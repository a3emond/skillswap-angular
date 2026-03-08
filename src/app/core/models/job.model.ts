



export type Job = {
  owner_id: number;
  worker_id: number;
  category: string;
  status: 'open' | 'in_progress' | 'completed';

}
