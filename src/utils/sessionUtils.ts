/**
 * Session timeout utilities to automatically log out idle users
 */

// Default timeout in milliseconds (30 minutes)
const DEFAULT_TIMEOUT = 30 * 60 * 1000; 

export interface SessionTimeoutConfig {
  /** Timeout duration in milliseconds before logout */
  timeout?: number; 
  /** Function to call when session expires */
  onTimeout: () => void;
  /** Whether the session timeout is active */
  isEnabled?: boolean;
}

export class SessionTimeout {
  private timeoutId: NodeJS.Timeout | null = null;
  private lastActivity: number = Date.now();
  private config: SessionTimeoutConfig;
  private eventsBound: boolean = false;

  constructor(config: SessionTimeoutConfig) {
    this.config = {
      timeout: DEFAULT_TIMEOUT,
      isEnabled: true,
      ...config
    };
    
    // Start session timer
    this.resetTimer();
    
    // Bind activity listeners if not already bound
    if (!this.eventsBound) {
      this.bindActivityEvents();
    }
  }

  /**
   * Reset the inactivity timer
   */
  resetTimer(): void {
    if (!this.config.isEnabled) return;
    
    // Clear any existing timeout
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    
    // Set the last activity time to now
    this.lastActivity = Date.now();
    
    // Start a new timeout
    this.timeoutId = setTimeout(() => {
      this.handleTimeout();
    }, this.config.timeout);
  }

  /**
   * Handle timeout expiration
   */
  private handleTimeout(): void {
    // Check if we're still inactive
    const now = Date.now();
    const elapsedTime = now - this.lastActivity;
    
    if (elapsedTime >= (this.config.timeout as number)) {
      console.log('Session timeout: User inactive for', elapsedTime, 'ms');
      this.config.onTimeout();
    }
  }

  /**
   * Bind user activity event listeners
   */
  private bindActivityEvents(): void {
    if (typeof window === 'undefined') return;
    
    // User activity events to listen for
    const events = [
      'mousedown', 'mousemove', 'keydown',
      'scroll', 'touchstart', 'click', 'focus'
    ];
    
    const activityHandler = this.resetTimer.bind(this);
    
    // Attach event listeners
    events.forEach(event => {
      window.addEventListener(event, activityHandler, { passive: true });
    });
    
    // Add visibility change listener to catch when user returns to tab
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.resetTimer();
      }
    });
    
    this.eventsBound = true;
  }

  /**
   * Clean up all event listeners and timeouts
   */
  cleanup(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    
    if (this.eventsBound && typeof window !== 'undefined') {
      const events = [
        'mousedown', 'mousemove', 'keydown',
        'scroll', 'touchstart', 'click', 'focus'
      ];
      
      const activityHandler = this.resetTimer.bind(this);
      
      events.forEach(event => {
        window.removeEventListener(event, activityHandler);
      });
      
      document.removeEventListener('visibilitychange', () => {});
      
      this.eventsBound = false;
    }
  }
  
  /**
   * Enable or disable session timeout
   */
  setEnabled(isEnabled: boolean): void {
    this.config.isEnabled = isEnabled;
    
    if (isEnabled) {
      this.resetTimer();
    } else if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
  
  /**
   * Update timeout duration
   */
  setTimeout(timeout: number): void {
    this.config.timeout = timeout;
    this.resetTimer();
  }
}
