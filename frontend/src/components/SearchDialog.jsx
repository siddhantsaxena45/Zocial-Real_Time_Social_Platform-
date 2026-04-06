import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

const SearchDialog = ({ open, setOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { suggestedUsers } = useSelector((state) => state.auth);

  // Filter users based on search
  const filteredUsers = suggestedUsers?.filter(user => {
    const q = searchQuery.toLowerCase();
    return user.username.toLowerCase().includes(q) || 
           user.email.toLowerCase().includes(q) ||
           user.skills?.some(skill => skill.toLowerCase().includes(q));
  }) || [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-white border-none shadow-2xl rounded-2xl glass-card z-50">
        <DialogHeader className="border-b border-gray-100 pb-4">
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-slate-900">
            <Search className="h-5 w-5 text-indigo-600" />
            Network Search
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <Input 
            placeholder="Search by username, email, or skill (e.g., Python)..."
            className="w-full bg-slate-50 border-input rounded-xl focus-visible:ring-indigo-500 mb-4 h-12 px-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />

          <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-2">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <Link 
                  key={user._id} 
                  to={`/profile/${user._id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-4 p-3 hover:bg-indigo-50/50 rounded-xl transition-colors w-full border border-transparent hover:border-indigo-100 group"
                >
                  <Avatar className="h-12 w-12 border border-slate-200">
                    <AvatarImage src={user.profilepicture || "https://github.com/shadcn.png"} alt={user.username} />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold">
                      {user.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col flex-1">
                    <span className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {user.username}
                    </span>
                    <span className="text-xs text-slate-500 truncate max-w-[200px]">
                      {user.bio || "Zocial Network Member"}
                    </span>
                    {user.skills && user.skills.length > 0 && (
                      <div className="flex gap-1 mt-1 overflow-hidden">
                        {user.skills.slice(0, 3).map(skill => (
                          <span key={skill} className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-bold uppercase rounded-md whitespace-nowrap">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-12 text-slate-500">
                <p className="text-sm font-medium">No intelligence found for "{searchQuery}"</p>
                <p className="text-xs mt-1">Try a different username</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
