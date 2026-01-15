import { useState, useEffect } from 'react';
import {
  loadGoogleCalendarScript,
  signInWithGoogle,
  signOutGoogle,
  isGoogleSignedIn,
  getGoogleCalendarEvents,
  createGoogleCalendarEvent,
  GoogleCalendarEvent,
} from 'lib/google-calendar';
import { Dayjs } from 'dayjs';
import { useAuth } from 'providers/AuthProvider';

export const useGoogleCalendar = () => {
  const { user } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<GoogleCalendarEvent[]>([]);

  useEffect(() => {
    const initGoogleCalendar = async () => {
      try {
        await loadGoogleCalendarScript();
        setIsLoaded(true);
        
        // Verifica se está logado (pode ter sido restaurado automaticamente durante loadGoogleCalendarScript)
        let signedIn = isGoogleSignedIn();
        
        // Se não está logado mas há token salvo, tenta restaurar
        if (!signedIn) {
          try {
            signedIn = await signInWithGoogle(false);
          } catch (error) {
            // Se falhar, não faz nada - usuário precisará fazer login manualmente
            console.log('Não foi possível restaurar sessão automaticamente');
          }
        }
        
        setIsSignedIn(signedIn);
        console.log('Google Calendar inicializado. Logado:', signedIn);
      } catch (error: any) {
        console.error('Erro ao carregar Google Calendar:', error);
        setIsLoaded(false);
      } finally {
        setLoading(false);
      }
    };

    initGoogleCalendar();
  }, []);

  // Reconecta automaticamente quando o usuário está logado no sistema
  useEffect(() => {
    const tryReconnect = async () => {
      // Só tenta reconectar se: usuário está logado, API carregada, não está conectado ainda, e não está carregando
      if (user && isLoaded && !isSignedIn && !loading) {
        try {
          // Tenta reconectar silenciosamente (sem popup se já tiver autorização)
          const signedIn = await signInWithGoogle(false);
          if (signedIn) {
            setIsSignedIn(true);
            console.log('Google Calendar reconectado automaticamente');
          }
        } catch (error) {
          // Se falhar silenciosamente, não faz nada - usuário precisará clicar no botão
          // Isso acontece se não tiver autorização prévia
        }
      }
    };

    // Aguarda um pouco para garantir que tudo está pronto
    const timeout = setTimeout(() => {
      tryReconnect();
    }, 500);

    return () => clearTimeout(timeout);
  }, [user, isLoaded, isSignedIn, loading]);

  const handleSignIn = async (): Promise<boolean> => {
    try {
      if (!isLoaded) {
        throw new Error('Google API ainda não foi carregada. Aguarde alguns instantes.');
      }
      
      const signedIn = await signInWithGoogle(true);
      setIsSignedIn(signedIn);
      return signedIn;
    } catch (error: any) {
      console.error('Erro no handleSignIn:', error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    await signOutGoogle();
    setIsSignedIn(false);
    setEvents([]);
  };

  const fetchEvents = async (startDate: Dayjs, endDate: Dayjs) => {
    if (!isSignedIn) return;

    try {
      const timeMin = startDate.toISOString();
      const timeMax = endDate.toISOString();
      const calendarEvents = await getGoogleCalendarEvents(timeMin, timeMax);
      setEvents(calendarEvents);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    }
  };

  const addEvent = async (
    summary: string,
    startDateTime: string,
    endDateTime: string,
    description?: string
  ) => {
    if (!isSignedIn) return null;

    try {
      const event = await createGoogleCalendarEvent(
        summary,
        startDateTime,
        endDateTime,
        description
      );
      if (event) {
        setEvents((prev) => [...prev, event]);
      }
      return event;
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      return null;
    }
  };

  return {
    isLoaded,
    isSignedIn,
    loading,
    events,
    handleSignIn,
    handleSignOut,
    fetchEvents,
    addEvent,
  };
};