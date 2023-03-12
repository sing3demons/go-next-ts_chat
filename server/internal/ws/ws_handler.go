package ws

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

type Handler struct {
	hub *Hub
}

func NewHandler(hub *Hub) *Handler {
	return &Handler{hub: hub}
}

type ReqRoom struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

func (h *Handler) CreateRoom(c *gin.Context) {
	var req ReqRoom

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	h.hub.Rooms[req.ID] = &Room{
		ID:      req.ID,
		Name:    req.Name,
		Clients: make(map[string]*Client),
	}

	c.JSON(http.StatusOK, req)
}

var upgrader = websocket.Upgrader{
	WriteBufferSize: 1024,
	ReadBufferSize:  1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func (h *Handler) JoinRoom(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	roomId := c.Param("roomId")
	clientId := c.Query("userId")
	username := c.Query("username")

	cl := &Client{
		Conn:     conn,
		Message:  make(chan *Message, 10),
		ID:       clientId,
		RoomID:   roomId,
		Username: username,
	}

	m := &Message{
		Content:  "A new user has joined the room",
		RoomID:   roomId,
		Username: username,
	}

	h.hub.Register <- cl
	h.hub.Broadcast <- m

	// writeMessage
	go cl.writeMessage()
	// readMessage
	cl.readMessage(h.hub)

}

type ResRoom struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

func (h *Handler) GetRooms(c *gin.Context) {
	rooms := []ResRoom{}

	for _, r := range h.hub.Rooms {
		rooms = append(rooms, ResRoom{
			ID:   r.ID,
			Name: r.Name,
		})
	}

	c.JSON(http.StatusOK, rooms)
}

type ResClients struct {
	ID       string `json:"id"`
	Username string `json:"username"`
}

func (h *Handler) GetClients(c *gin.Context) {
	var cs []ResClients
	roomId := c.Param("roomId")
	if _, ok := h.hub.Rooms[roomId]; !ok {
		cs = make([]ResClients, 0)
		c.JSON(http.StatusOK, cs)
	}

	for _, cc := range h.hub.Rooms[roomId].Clients {
		cs = append(cs, ResClients{
			ID:       cc.ID,
			Username: cc.Username,
		})
	}

	c.JSON(http.StatusOK, cs)
}
