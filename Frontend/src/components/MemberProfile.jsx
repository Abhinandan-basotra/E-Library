import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Book, Settings, CreditCard, LogOut, User, BookOpen, Heart, Star, History } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {USER_API_END_POINT} from '../utils/constant'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setUser } from '../redux/authSlice';
import { toast } from 'react-toastify';

const MemberProfile = () => {
  //getNumberOfBorrowedBooks();
  const { user } = useSelector(store => store.auth);
  const { purchasedBooks = [] } = useSelector(store => store.books);
  
  // Filter books by accessType and ensure we have the book object
  const borrowedBooks = purchasedBooks
    .filter(book => book.accessType === 'subscription')
    .map(book => ({
      ...book,
      title: book.bookId?.title || book.title || 'Untitled Book',
      coverUrl: book.bookId?.coverUrl || book.coverUrl
    }));
    
  const boughtBooks = purchasedBooks
    .filter(book => book.accessType === 'Buy')
    .map(book => ({
      ...book,
      title: book.bookId?.title || book.title || 'Untitled Book',
      coverUrl: book.bookId?.coverUrl || book.coverUrl,
      author: book.bookId?.author || book.author
    }));
  
  const numberOfBorrowedBooks = borrowedBooks.length;
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
        const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
        if (res.data.success) {
            dispatch(setUser(null));
            navigate('/');
            toast.success(res.data.message);
        }
    } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
    }
}

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"} alt="profile" />
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0">
        <div className="p-4 border-b">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"} alt="profile" />
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-lg">{user?.fullname}</h4>
              </div>
              <p className="text-sm text-muted-foreground">{user?.profile?.bio}</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="borrowed" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="borrowed" className="text-xs py-1">Borrowed</TabsTrigger>
            <TabsTrigger value="reading" className="text-xs py-1">Reading</TabsTrigger>
            <TabsTrigger value="account" className="text-xs py-1">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="borrowed" className="p-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Borrowed Books Column */}
              <div>
                <div className="border rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-sm flex items-center gap-2 text-gray-700">
                      <div className="p-1.5 bg-blue-50 rounded-full">
                        <Book className="h-4 w-4 text-blue-600"/>
                      </div>
                      <span>Borrowed Books</span>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {numberOfBorrowedBooks}
                      </span>
                    </h5>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2 -mr-2">
                    {borrowedBooks.length > 0 ? (
                      borrowedBooks.map((book) => (
                        <div key={book._id} className="group flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                          <div className="h-10 w-10 bg-blue-50 rounded-md flex items-center justify-center mr-3 flex-shrink-0">
                            <Book className="h-4 w-4 text-blue-600"/>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{book.title}</p>
                            <p className="text-xs text-gray-500">
                              {book.author && `${book.author} • `}
                              Borrowed on {new Date(book.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-500">No books currently borrowed</p>
                        <Button variant="link" size="sm" className="text-xs text-blue-600 hover:text-blue-800 mt-1">
                          Browse Books
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Purchased Books Column */}
              <div className="border rounded-lg p-4 bg-white shadow-sm">
                <h5 className="font-medium text-sm mb-3 text-gray-700">
                  Purchased Books ({boughtBooks.length})
                  </h5>
                <div className="space-y-2">
                  {boughtBooks.length > 0 ? (
                    <ul className="space-y-1">
                      {boughtBooks.map((book) => (
                        <li key={book._id}>
                          <a 
                            href={`/book/${book._id || 'dummy'}`} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline block py-1 px-2 -mx-2 rounded hover:bg-gray-50"
                          >
                            {book.title || 'Untitled Book'}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                      <p className="text-sm text-gray-500">No purchased books yet</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reading" className="p-4 max-h-64 overflow-y-auto">
            <h5 className="font-medium text-sm mb-2 flex items-center gap-1">
              <BookOpen className="h-4 w-4" /> Books in Progress
            </h5>
            
            <h5 className="font-medium text-sm mt-4 mb-2 flex items-center gap-1">
              <Star className="h-4 w-4" /> Recently Completed
            </h5>
            {user.borrowedBooks.map((book, idx) => (
              <div key={idx} className="text-sm mb-2 pb-2 border-b border-gray-100">{book}</div>
            ))}
          </TabsContent>

          <TabsContent value="account" className="p-4 max-h-64 overflow-y-auto">
            <div className="flex flex-col space-y-2">
              <Link to="/profile" className="flex items-center gap-2 text-sm py-1 hover:bg-gray-50 px-2 rounded">
                <User className="h-4 w-4" />
                Update Profile
              </Link>
              <Link to="/settings" className="flex items-center gap-2 text-sm py-1 hover:bg-gray-50 px-2 rounded">
                <Settings className="h-4 w-4" />
                Account Settings
              </Link>
              <Button variant="destructive" size="sm" className="mt-4 w-full flex items-center justify-center gap-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default MemberProfile;