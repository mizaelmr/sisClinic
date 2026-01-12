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

export const useGoogleCalendar = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<GoogleCalendarEvent[]>([]);

  useEffect(() => {
    const initGoogleCalendar = async () => {
      try {
        await loadGoogleCalendarScript();
        setIsLoaded(true);
        const signedIn = isGoogleSignedIn();
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

  const handleSignIn = async (): Promise<boolean> => {
    try {
      if (!isLoaded) {
        throw new Error('Google API ainda não foi carregada. Aguarde alguns instantes.');
      }
      
      const signedIn = await signInWithGoogle();
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