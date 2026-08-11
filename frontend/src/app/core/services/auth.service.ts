import { Injectable } from "@angular/core";
import { createClient, Session, SupabaseClient } from "@supabase/supabase-js";
import { environment } from "../../../environments/environment";

// Usa @supabase/supabase-js somente para login/sessão (seção 8 do CLAUDE.md).
// CRUD de negócio nunca passa por aqui — sempre via UsersService -> API Express.
@Injectable({ providedIn: "root" })
export class AuthService {
  private client: SupabaseClient = createClient(environment.supabaseUrl, environment.supabaseAnonKey);

  signInWithPassword(email: string, password: string) {
    return this.client.auth.signInWithPassword({ email, password });
  }

  signOut() {
    return this.client.auth.signOut();
  }

  async getSession(): Promise<Session | null> {
    const { data } = await this.client.auth.getSession();
    return data.session;
  }

  async getAccessToken(): Promise<string | null> {
    const session = await this.getSession();
    return session?.access_token ?? null;
  }
}
