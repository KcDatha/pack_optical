import { handle, type Env } from '../_handler';
export const onRequest = ({ request, env }: { request: Request; env: Env }) => handle('contact', request, env);
