import { API_URL, WEBSOCKET_URL } from '@/constants'
import { AuthContext } from '@/modules/auth_provider'
import { WebsocketContext } from '@/modules/websocket_provider'
import { Router, useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface User {
  id: string
  name: string
}

export default function index() {
  const [rooms, setRooms] = useState<User[]>([])
  const [roomName, setRoomName] = useState('')
  const { user } = useContext(AuthContext)
  const { setConn } = useContext(WebsocketContext)
  const router = useRouter()

  const getRooms = async () => {
    try {
      const res = await fetch(`${API_URL}/ws/getRooms`, {
        method: 'GET',
      })

      const data = await res.json()
      if (res.ok) {
        console.log(data)

        setRooms(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getRooms()
  }, [])

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_URL}/ws/createRoom`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: uuidv4(),
          name: roomName,
        }),
      })
      setRoomName('')

      if (res.ok) {
        getRooms()
      }
    } catch (err) {
      console.log(err)
    }
  }

  const joinRoom = (id: string) => {
    const url = new URL(`${WEBSOCKET_URL}/ws/joinRoom/${id}`)
    url.searchParams.set('userId', user.id)
    url.searchParams.set('username', user.username)
    console.log(JSON.stringify(url))

    const ws = new WebSocket(url)
    if (ws.OPEN) {
      setConn(ws)
      router.push('/chat')
    }
    console.log(ws)

    alert(id)
  }
  return (
    <>
      <div className="my-8 px-4 md:mx-32 w-full h-full">
        <div className="flex justify-center mt-3 p-5">
          <input
            type="text"
            className="border border-grey p-2 rounded-md focus:outline-none focus:border-blue"
            placeholder="room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <button
            className="bg-blue border text-white rounded-md p-2 md:ml-4"
            onClick={submitHandler}
            disabled={roomName === ''}
          >
            create room
          </button>
        </div>
        <div className="mt-6">
          <div className="font-bold">Available Rooms</div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
            {rooms.map((room, index) => (
              <div
                key={index}
                className="border border-blue p-4 flex items-center rounded-md w-full"
              >
                <div className="w-full">
                  <div className="text-sm">room</div>
                  <div className="text-blue font-bold text-lg">{room.name}</div>
                </div>
                <div className="">
                  <button
                    className="px-4 text-white bg-blue rounded-md"
                    onClick={() => joinRoom(room.id)}
                  >
                    join
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
