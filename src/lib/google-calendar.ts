export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
export const GOOGLE_CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '';
export const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';

export const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events';

export interface GoogleCalendarEvent {
    id: string;
    summary: string;
    start: {
        dateTime?: string;
        date?: string;
    };
    end: {
        dateTime?: string;
        date?: string;
    };
    description?: string;
}

let tokenClient: any = null;
let accessToken: string | null = null;

export const loadGoogleCalendarScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!GOOGLE_CLIENT_ID || !GOOGLE_API_KEY) {
        const error = 'Credenciais do Google não configuradas. Verifique o arquivo .env';
        console.error(error, {
          CLIENT_ID: GOOGLE_CLIENT_ID ? 'Configurado' : 'FALTANDO',
          API_KEY: GOOGLE_API_KEY ? 'Configurado' : 'FALTANDO'
        });
        reject(new Error(error));
        return;
      }

      if (window.google && window.gapi && window.gapi.client) {
        console.log('Google API já carregada');
        resolve();
        return;
      }

      const loadScript = (src: string, id: string): Promise<void> => {
        return new Promise((scriptResolve, scriptReject) => {
          if (document.querySelector(`script[src="${src}"]`)) {
            scriptResolve();
            return;
          }

          const script = document.createElement('script');
          script.src = src;
          script.async = true;
          script.defer = true;
          script.id = id;
          
          script.onload = () => scriptResolve();
          script.onerror = () => scriptReject(new Error(`Erro ao carregar ${src}`));
          
          document.head.appendChild(script);
        });
      };

      Promise.all([
        loadScript('https://accounts.google.com/gsi/client', 'google-gsi'),
        loadScript('https://apis.google.com/js/api.js', 'google-api')
      ]).then(() => {
        console.log('Scripts do Google carregados');
        initializeGapi(resolve, reject);
      }).catch((error) => {
        reject(new Error(`Erro ao carregar scripts do Google: ${error.message}`));
      });
    });
  };

  const initializeGapi = (resolve: () => void, reject: (error: Error) => void) => {
    if (!window.google || !window.gapi || !window.gapi.load) {
      reject(new Error('Bibliotecas do Google não disponíveis'));
      return;
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
    });

    window.gapi.load('client', {
      callback: () => {
        console.log('Módulo client carregado');
        window.gapi.client.init({
          apiKey: GOOGLE_API_KEY,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        }).then(() => {
          console.log('Google API inicializada com sucesso');
          
          tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: SCOPES,
            callback: (tokenResponse: any) => {
              accessToken = tokenResponse.access_token;
              console.log('Token de acesso obtido');
            },
          });
          
          resolve();
        }).catch((error: any) => {
          console.error('Erro detalhado ao inicializar Google API:', error);
          let errorMessage = 'Erro ao inicializar Google API';
          
          if (error.details) {
            errorMessage += `: ${error.details}`;
          } else if (error.message) {
            errorMessage += `: ${error.message}`;
          } else if (error.error) {
            errorMessage += `: ${JSON.stringify(error.error)}`;
          }
          
          reject(new Error(errorMessage));
        });
      },
      onerror: () => {
        reject(new Error('Erro ao carregar módulo client do Google'));
      },
      timeout: 10000,
      ontimeout: () => {
        reject(new Error('Timeout ao carregar módulo client'));
      }
    });
  };

  export const signInWithGoogle = async (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      try {
        if (!tokenClient) {
          reject(new Error('Google API não foi carregada. Aguarde alguns instantes e tente novamente.'));
          return;
        }

        if (accessToken) {
          window.gapi.client.setToken({ access_token: accessToken });
          resolve(true);
          return;
        }

        tokenClient.callback = (response: any) => {
          if (response.error) {
            console.error('Erro na autenticação:', response);
            if (response.error === 'popup_closed_by_user') {
              reject(new Error('Login cancelado pelo usuário'));
            } else if (response.error === 'access_denied') {
              reject(new Error('Acesso negado. Verifique as permissões no Google Cloud Console'));
            } else {
              reject(new Error(`Erro na autenticação: ${response.error}`));
            }
            return;
          }

          accessToken = response.access_token;
          window.gapi.client.setToken({ access_token: accessToken });
          resolve(true);
        };

        if (window.gapi.client.getToken() === null) {
          tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
          tokenClient.requestAccessToken({ prompt: '' });
        }
      } catch (error: any) {
        console.error('Erro ao fazer login com Google:', error);
        reject(new Error(error.message || 'Erro ao fazer login com Google'));
      }
    });
  }

  export const signOutGoogle = async (): Promise<void> => {
    try {
      const token = window.gapi.client.getToken();
      if (token) {
        window.google.accounts.oauth2.revoke(token.access_token);
        window.gapi.client.setToken('');
        accessToken = null;
      }
    } catch (error) {
      console.error('Erro ao fazer logout do Google:', error);
    }
  };
  
  export const isGoogleSignedIn = (): boolean => {
    try {
      if (!window.gapi || !window.gapi.client) return false;
      const token = window.gapi.client.getToken();
      return token !== null && token !== undefined;
    } catch (error) {
      console.error('Erro ao verificar status de login:', error);
      return false;
    }
  };
  
  export const getGoogleCalendarEvents = async (
    timeMin: string,
    timeMax: string
  ): Promise<GoogleCalendarEvent[]> => {
    try {
      const response = await window.gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin,
        timeMax: timeMax,
        showDeleted: false,
        singleEvents: true,
        orderBy: 'startTime',
      });
  
      return response.result.items || [];
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      return [];
    }
  };
  
  export const createGoogleCalendarEvent = async (
    summary: string,
    startDateTime: string,
    endDateTime: string,
    description?: string
  ): Promise<GoogleCalendarEvent | null> => {
    try {
      const event = {
        summary,
        start: {
          dateTime: startDateTime,
          timeZone: 'America/Sao_Paulo',
        },
        end: {
          dateTime: endDateTime,
          timeZone: 'America/Sao_Paulo',
        },
        description: description || '',
      };
  
      const response = await window.gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });
  
      return response.result;
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      return null;
    }
  };
  
  declare global {
    interface Window {
      gapi: any;
      google: any;
    }
  }