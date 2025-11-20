import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Fade,
  Slide,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { chatbotApi } from '@/services/api';
import { format } from 'date-fns';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: '¡Hola! 👋 Soy el asistente virtual de Concierge. ¿En qué puedo ayudarte?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleSend = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage: Message = {
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await chatbotApi.sendMessage(inputValue.trim());
      const botMessage: Message = {
        text: response.response,
        isUser: false,
        timestamp: new Date(response.timestamp),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        text: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1300,
        }}
      >
        <Fade in={!open}>
          <IconButton
            onClick={() => setOpen(true)}
            sx={{
              width: 64,
              height: 64,
              bgcolor: 'primary.main',
              color: 'white',
              boxShadow: 3,
              '&:hover': {
                bgcolor: 'primary.dark',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <ChatIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Fade>
      </Box>

      {/* Widget de chat */}
      <Slide direction="up" in={open} mountOnEnter unmountOnExit>
        <Paper
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: { xs: 'calc(100% - 48px)', sm: 400 },
            height: 600,
            maxHeight: { xs: 'calc(100vh - 48px)', sm: 600 },
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1300,
            boxShadow: 6,
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Avatar sx={{ bgcolor: 'primary.dark' }}>
              <SmartToyIcon />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" fontWeight="bold">
                Asistente Virtual
              </Typography>
              <Typography variant="caption">Concierge Support</Typography>
            </Box>
            <IconButton
              onClick={() => setOpen(false)}
              sx={{ color: 'white' }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Mensajes */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              p: 2,
              bgcolor: '#f5f5f5',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                  gap: 1,
                }}
              >
                {!message.isUser && (
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      width: 32,
                      height: 32,
                    }}
                  >
                    <SmartToyIcon sx={{ fontSize: 20 }} />
                  </Avatar>
                )}
                <Box
                  sx={{
                    maxWidth: '75%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                  }}
                >
                  <Paper
                    sx={{
                      p: 1.5,
                      bgcolor: message.isUser ? 'primary.main' : 'white',
                      color: message.isUser ? 'white' : 'text.primary',
                      borderRadius: 2,
                      boxShadow: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                      {message.text}
                    </Typography>
                  </Paper>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.7rem',
                      alignSelf: message.isUser ? 'flex-end' : 'flex-start',
                      px: 1,
                    }}
                  >
                    {format(message.timestamp, 'HH:mm')}
                  </Typography>
                </Box>
                {message.isUser && (
                  <Avatar
                    sx={{
                      bgcolor: 'primary.light',
                      width: 32,
                      height: 32,
                    }}
                  >
                    U
                  </Avatar>
                )}
              </Box>
            ))}
            {loading && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  gap: 1,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    width: 32,
                    height: 32,
                  }}
                >
                  <SmartToyIcon sx={{ fontSize: 20 }} />
                </Avatar>
                <Paper
                  sx={{
                    p: 1.5,
                    bgcolor: 'white',
                    borderRadius: 2,
                    boxShadow: 1,
                  }}
                >
                  <Typography variant="body2">Escribiendo...</Typography>
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input */}
          <Box
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: 'divider',
              bgcolor: 'white',
              display: 'flex',
              gap: 1,
            }}
          >
            <TextField
              inputRef={inputRef}
              fullWidth
              placeholder="Escribe tu mensaje..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              size="small"
              variant="outlined"
            />
            <IconButton
              onClick={handleSend}
              disabled={!inputValue.trim() || loading}
              color="primary"
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                '&.Mui-disabled': {
                  bgcolor: 'action.disabledBackground',
                  color: 'action.disabled',
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Slide>
    </>
  );
}

