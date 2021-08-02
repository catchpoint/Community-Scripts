// dependent packages / files required for project
import bunyan from 'bunyan';
import RotatingFileStream from 'bunyan-rotating-file-stream';

// Logger,for Error and info Logging
var log = bunyan.createLogger({
  serializers: bunyan.stdSerializers,
  name: 'node_detail',
  streams: [{
    level: 'info',
    stream: new RotatingFileStream({
      path: 'logs/info/info.%d-%b-%y.log',
      period: '1d', // daily rotation
      totalFiles: 10, // keep 10 back copies
      rotateExisting: true, // Give ourselves a clean file when we start up, based on period
      threshold: '10m', // Rotate log files larger than 10 megabytes
      totalSize: '20m', // Don't keep more than 20mb of archived log files
      gzip: true // Compress the archive log files to save space
    })
  },
  {
    level: 'error',
    stream: new RotatingFileStream({
      path: 'logs/error/error.%d-%b-%y.log',
      period: '1d', // daily rotation
      totalFiles: 10, // keep 10 back copies
      rotateExisting: true, // Give ourselves a clean file when we start up, based on period
      threshold: '10m', // Rotate log files larger than 10 megabytes
      totalSize: '20m', // Don't keep more than 20mb of archived log files
      gzip: true // Compress the archive log files to save space
    })
  }]
});

export default log;
