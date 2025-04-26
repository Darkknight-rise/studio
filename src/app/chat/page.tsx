'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SendHorizonal, UserCircle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';


// Mock data for conversations and messages - replace with Firestore data
const mockConversations = [
    { id: 'c1', otherUserId: 'donor1', otherUserName: 'John D.', lastMessage: 'Okay, sounds good!', unread: 0, type: 'Donor' },
    { id: 'c2', otherUserId: 'receiver1', otherUserName: 'Bob R.', lastMessage: 'Can I pick up tomorrow?', unread: 2, type: 'Receiver' },
    { id: 'c3', otherUserId: 'ngo1', otherUserName: 'Hope NGO', lastMessage: 'Please confirm the pickup time.', unread: 0, type: 'NGO' },
    { id: 'c4', otherUserId: 'donor2', otherUserName: 'Bakery A', lastMessage: 'Yes, the bread is ready.', unread: 0, type: 'Donor' },
];

const mockMessages: { [key: string]: { id: string; senderId: string; text: string; timestamp: Date }[] } = {
    'c1': [
        { id: 'm1', senderId: 'me', text: 'Hi John, is the food still available?', timestamp: new Date(Date.now() - 5 * 60 * 1000) },
        { id: 'm2', senderId: 'donor1', text: 'Yes, it is!', timestamp: new Date(Date.now() - 4 * 60 * 1000) },
        { id: 'm3', senderId: 'donor1', text: 'Okay, sounds good!', timestamp: new Date(Date.now() - 3 * 60 * 1000) },
    ],
    'c2': [
        { id: 'm4', senderId: 'receiver1', text: 'Hello!', timestamp: new Date(Date.now() - 10 * 60 * 1000) },
        { id: 'm5', senderId: 'receiver1', text: 'Can I pick up tomorrow?', timestamp: new Date(Date.now() - 9 * 60 * 1000) },
    ],
    'c3': [
        { id: 'm6', senderId: 'ngo1', text: 'Please confirm the pickup time.', timestamp: new Date(Date.now() - 15 * 60 * 1000) },
    ],
     'c4': [
        { id: 'm7', senderId: 'me', text: 'Is the bread ready for pickup?', timestamp: new Date(Date.now() - 2 * 60 * 1000) },
        { id: 'm8', senderId: 'donor2', text: 'Yes, the bread is ready.', timestamp: new Date(Date.now() - 1 * 60 * 1000) },
    ]
};


export default function ChatPage() {
    const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);
    const [selectedConversationId, setSelectedConversationId] = React.useState<string | null>(null);
    const [conversations, setConversations] = React.useState(mockConversations);
    const [messages, setMessages] = React.useState<typeof mockMessages['c1']>([]);
    const [newMessage, setNewMessage] = React.useState('');
     const { toast } = useToast();

    React.useEffect(() => {
        // Fetch current user ID from local storage (MVP)
        const userId = localStorage.getItem('foodConnectUserId');
         if (!userId) {
            toast({title: "Login Required", description: "Please register or login to use chat.", variant: "destructive"})
            // redirect?
        }
        setCurrentUserId(userId || 'me'); // Default to 'me' for mock data

        // TODO: Fetch actual conversations and messages from Firestore
        // - Fetch conversations where currentUserId is a participant
        // - Set up real-time listeners for new messages/conversations
    }, [toast]);

    React.useEffect(() => {
        // Load messages when a conversation is selected
        if (selectedConversationId) {
            setMessages(mockMessages[selectedConversationId] || []);
            // TODO: Fetch messages for the selected conversation from Firestore
            // Mark messages as read
             setConversations(convos => convos.map(c => c.id === selectedConversationId ? {...c, unread: 0} : c));
        } else {
            setMessages([]);
        }
    }, [selectedConversationId]);

    // TODO: Implement send message logic
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversationId || !currentUserId) return;

        const messageText = newMessage;
        setNewMessage(''); // Clear input immediately

        const tempMessageId = `temp_${Date.now()}`;
        const timestamp = new Date();

         // Add message optimistically to UI
        setMessages(prev => [...prev, { id: tempMessageId, senderId: currentUserId, text: messageText, timestamp }]);


        console.log(`Sending message "${messageText}" to conversation ${selectedConversationId}`);
        // Simulate API call / Firestore write
         await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

         // Update UI after successful send (or handle error)
         // If using real-time listeners, this might not be necessary as the listener will update the state.
         // For optimistic UI, you might replace the temp message with the real one from the listener.

        // Update last message in conversation list (mock)
         setConversations(convos => convos.map(c =>
            c.id === selectedConversationId ? { ...c, lastMessage: messageText } : c
        ));

    };

    const selectedConversation = conversations.find(c => c.id === selectedConversationId);

    return (
        <div className="container mx-auto px-0 md:px-4 py-8 h-[calc(100vh-8rem)] flex">
            {/* Conversation List */}
            <Card className="w-1/3 hidden md:flex flex-col h-full mr-4">
                <CardHeader className="border-b">
                    <CardTitle>Conversations</CardTitle>
                </CardHeader>
                <ScrollArea className="flex-grow">
                    <CardContent className="p-2">
                         {conversations.map((convo) => (
                             <Button
                                key={convo.id}
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start h-auto py-3 px-2 mb-1 text-left",
                                    selectedConversationId === convo.id && "bg-accent text-accent-foreground"
                                )}
                                onClick={() => setSelectedConversationId(convo.id)}
                            >
                                <Avatar className="h-8 w-8 mr-3">
                                    {/* Placeholder image */}
                                    <AvatarFallback>
                                        {convo.type === 'NGO' ? <Users/> : <UserCircle />}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-grow overflow-hidden">
                                    <p className="font-semibold truncate">{convo.otherUserName} <span className="text-xs text-muted-foreground">({convo.type})</span></p>
                                    <p className={cn("text-xs truncate", convo.unread > 0 ? "font-bold text-foreground" : "text-muted-foreground")}>{convo.lastMessage}</p>
                                </div>
                                {convo.unread > 0 && (
                                    <Badge className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                        {convo.unread}
                                    </Badge>
                                )}
                            </Button>
                        ))}
                    </CardContent>
                </ScrollArea>
            </Card>

            {/* Chat Window */}
            <Card className="flex-grow flex flex-col h-full">
                {selectedConversation ? (
                    <>
                        <CardHeader className="border-b flex flex-row items-center space-x-3 py-3">
                             <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                    {selectedConversation.type === 'NGO' ? <Users/> : <UserCircle />}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-base">{selectedConversation.otherUserName}</CardTitle>
                                 <CardDescription className="text-xs">{selectedConversation.type}</CardDescription>
                             </div>
                        </CardHeader>
                        <ScrollArea className="flex-grow p-4 space-y-4">
                             {messages.map((msg, index) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "flex items-end space-x-2",
                                        msg.senderId === currentUserId ? "justify-end" : "justify-start"
                                    )}
                                >
                                    {msg.senderId !== currentUserId && (
                                         <Avatar className="h-6 w-6">
                                             <AvatarFallback className="text-xs">
                                                 {selectedConversation.type === 'NGO' ? <Users/> : <UserCircle />}
                                            </AvatarFallback>
                                         </Avatar>
                                    )}
                                     <div
                                        className={cn(
                                            "max-w-[70%] rounded-lg px-3 py-2 text-sm",
                                            msg.senderId === currentUserId
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted"
                                        )}
                                    >
                                        {msg.text}
                                         {/* Optional: Add timestamp */}
                                        {/* <p className="text-xs text-right mt-1 opacity-70">{format(msg.timestamp, 'p')}</p> */}
                                    </div>
                                     {msg.senderId === currentUserId && (
                                         <Avatar className="h-6 w-6">
                                             {/* Add current user avatar if available */}
                                            <AvatarFallback className="text-xs">Me</AvatarFallback>
                                         </Avatar>
                                    )}
                                </div>
                            ))}
                        </ScrollArea>
                        <CardContent className="p-4 border-t">
                            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                                <Input
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="flex-grow"
                                    autoComplete="off"
                                />
                                <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                                    <SendHorizonal className="h-4 w-4" />
                                </Button>
                            </form>
                        </CardContent>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                        <MessageSquare className="h-16 w-16 text-muted-foreground mb-4"/>
                        <p className="text-lg font-medium text-muted-foreground">Select a conversation</p>
                        <p className="text-sm text-muted-foreground">Choose someone from the list to start chatting.</p>
                        <p className="mt-4 text-xs text-muted-foreground md:hidden">Or open the menu to see conversations.</p>
                         {/* Mobile Conversation Trigger - Placeholder */}
                         <Button variant="outline" className="mt-4 md:hidden">View Conversations</Button>
                    </div>
                )}
            </Card>
        </div>
    );
}
