import express from 'express';
import { register } from 'prom-client';
import { MetricTypes } from '../metrics';

export default function NodeServer(port: number) {
  const _port = port;
  const server = express();

  function serverGet(type: MetricTypes) {
    const _type = type.toLowerCase();
    server.get(`/metrics/traffic_volumes_${_type}`, async (req, res) => {
      console.log('server get', _type);
      res.set('Content-Type', register.contentType);
      res.end(await register.getSingleMetricAsString(`traffic_volumes_${_type}`));
    });
  }

  function serverGetAll() {
    server.get('/metrics', async (req, res) => {
      res.set('Content-Type', register.contentType);
      res.end(await register.metrics());
    });
  }

  return {
    do() {
      serverGetAll();      
      serverGet('CAR');
      serverGet('BUS');
      serverGet('TRUCK');
      serverGet('MOTORCYCLE');
    
      server.listen(_port, () => {
        console.log(`metric server started in port ${_port}`);
      });
    }
  }
}