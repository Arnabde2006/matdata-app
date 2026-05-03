import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Send, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const ChatbotPage = () => {
  const { t, i18n } = useTranslation();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: i18n.language === 'en' ? 'Hello! I am your AI election assistant. How can I help you today?' : 'नमस्ते! मैं आपका एआई चुनाव सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions = i18n.language === 'en' ? [
    "How do I apply for Voter ID?",
    "What's the difference between Lok Sabha and Rajya Sabha?",
    "What documents do I need to vote?"
  ] : [
    "मैं वोटर आईडी के लिए कैसे आवेदन करूं?",
    "लोकसभा और राज्यसभा में क्या अंतर है?",
    "वोट देने के लिए कौन से दस्तावेज चाहिए?"
  ];

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text, language: i18n.language }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.response
        }]);
      } else {
        throw new Error(data.error || 'API Error');
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: i18n.language === 'en' ? 'Error connecting to the server.' : 'सर्वर से कनेक्ट करने में त्रुटि।'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 flex flex-col h-[calc(100vh-140px)]">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-heading font-bold text-accent mb-2 flex items-center justify-center gap-2">
          <Bot className="w-8 h-8" />
          {t('nav_chatbot')}
        </h2>
        <p className="text-muted-foreground">Ask anything about the Indian election process.</p>
      </div>

      <div className="flex-1 bg-card border border-border rounded-xl shadow-sm flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-secondary text-white'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-3 rounded-lg ${msg.role === 'user' ? 'bg-primary/10 text-foreground rounded-tr-none' : 'bg-muted text-foreground rounded-tl-none'}`}>
                  {msg.role === 'user' ? (
                    <p className="text-sm">{msg.content}</p>
                  ) : (
                    <div className="text-sm flex flex-col gap-2 overflow-hidden">
                      <ReactMarkdown
                        components={{
                          ul: ({ node, ...props }: any) => <ul className="list-disc pl-4" {...props} />,
                          ol: ({ node, ...props }: any) => <ol className="list-decimal pl-4" {...props} />,
                          li: ({ node, ...props }: any) => <li className="mt-1" {...props} />,
                          p: ({ node, ...props }: any) => <p className="mb-1 last:mb-0" {...props} />,
                          strong: ({ node, ...props }: any) => <strong className="font-semibold" {...props} />,
                          a: ({ node, ...props }: any) => <a className="text-primary underline underline-offset-2" {...props} />
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3 rounded-lg bg-muted text-foreground rounded-tl-none flex gap-1 items-center">
                  <div className="w-2 h-2 bg-secondary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggested */}
        {messages.length === 1 && (
          <div className="p-4 border-t border-border bg-muted/20">
            <p className="text-xs text-muted-foreground font-medium mb-2 uppercase">Suggested Questions</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="text-xs bg-background border border-border px-3 py-1.5 rounded-full hover:border-primary hover:text-primary transition-colors text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border bg-background">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            className="flex gap-2"
          >
            <input
              type="text"
              className="flex-1 px-4 py-2 border border-input bg-background rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={t('chatbot_placeholder')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4 ml-1" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
