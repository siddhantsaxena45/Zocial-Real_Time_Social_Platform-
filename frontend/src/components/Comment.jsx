import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'

const Comment = ({ comment }) => {
  return (
    <div className="flex items-center gap-3 w-full">
      {/* Avatar */}
      <Link to={`/profile/${comment?.author?._id}`} className="shrink-0 hover:opacity-80 transition-opacity">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment?.author?.profilepicture} className="object-cover w-full h-full" />
          <AvatarFallback className="bg-slate-100 font-bold text-slate-700">{comment?.author?.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
        </Avatar>
      </Link>

      {/* Text wrapper */}
      <div className="flex-1 text-sm sm:text-base leading-snug break-words overflow-hidden">
        <Link to={`/profile/${comment?.author?._id}`} className="font-semibold mr-2 text-sm hover:underline decoration-slate-300 underline-offset-2">
          {comment?.author?.username}
        </Link>
        <span className="break-words break-all overflow-hidden w-full text-slate-700">{comment?.text}</span>
      </div>
    </div>
  )
}

export default Comment
