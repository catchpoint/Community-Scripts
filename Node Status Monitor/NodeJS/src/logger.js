import bunyan from 'bunyan';
import RotatingFileStream from 'bunyan-rotating-file-stream';

const stream = new RotatingFileStream({
  path: 'output/%Y-%m-%d.log',
  period: '1d', // daily rotation
  totalFiles: 10, // keep 10 back copies
  rotateExisting: true, // Give ourselves a clean file when we start up, based on period
  threshold: '10m', // Rotate log files larger than 10 megabytes
  totalSize: '20m', // Don't keep more than 20mb of archived log files
  gzip: true // Compress the archive log files to save space
});

var log = bunyan.createLogger({
  serializers: bunyan.stdSerializers,
  name: 'node_detail',
  streams: [{
    level: 'info',
    stream: stream
  },
  {
    level: 'error',
    stream: stream
  }]
});

export default log;
