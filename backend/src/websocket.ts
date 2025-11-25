import { Server } from 'socket.io';
import { logger } from './utils/logger';

export function initializeWebSocket(io: Server) {
  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    socket.on('subscribe_job', (jobId: string) => {
      socket.join(`job:${jobId}`);
      logger.info(`Client ${socket.id} subscribed to job ${jobId}`);
    });

    socket.on('unsubscribe_job', (jobId: string) => {
      socket.leave(`job:${jobId}`);
      logger.info(`Client ${socket.id} unsubscribed from job ${jobId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });
}

export function emitJobProgress(io: Server, jobId: string, progress: number) {
  io.to(`job:${jobId}`).emit('job_progress', { jobId, progress });
}

export function emitJobCompleted(io: Server, jobId: string, result: any) {
  io.to(`job:${jobId}`).emit('job_completed', { jobId, result });
}

export function emitJobFailed(io: Server, jobId: string, error: string) {
  io.to(`job:${jobId}`).emit('job_failed', { jobId, error });
}

export function emitJobCreated(io: Server, jobId: string, job: any) {
  io.to(`job:${jobId}`).emit('job_created', { jobId, job });
}
