import { onCLS, onFCP, onFID, onLCP, onTTFB, type Metric } from 'web-vitals';

const ENDPOINT = 'https://vitals.vercel-analytics.com/v1/vitals';

function getConnectionSpeed() {
  // @ts-ignore
  return navigator?.connection?.effectiveType ?? '';
}

type MetricOptions = {
  params: Record<string, string>;
  path: string;
  analyticsId: string;
  debug?: boolean;
};

const send = (metric: Metric, options: MetricOptions) => {
  const page = Object.entries(options.params).reduce(
    (acc, [key, value]) => acc.replace(value, `[${key}]`),
    options.path
  );

  const body = {
    dsn: options.analyticsId,
    id: metric.id,
    page,
    href: location.href,
    event_name: metric.name,
    value: metric.value.toString(),
    speed: getConnectionSpeed()
  };

  if (options.debug) {
    console.log('[Web Vitals]', metric.name, JSON.stringify(body, null, 2));
  }

  const blob = new Blob([new URLSearchParams(body).toString()], {
    // This content type is necessary for `sendBeacon`
    type: 'application/x-www-form-urlencoded'
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon(ENDPOINT, blob);
    return;
  }

  fetch(ENDPOINT, {
    body: blob,
    method: 'POST',
    credentials: 'omit',
    keepalive: true
  });
};

export const webVitals = (options: MetricOptions) => {
  try {
    console.log(`[Web Vitals] for page ${options.path}`);
    onFID((metric) => send(metric, options));
    onTTFB((metric) => send(metric, options));
    onLCP((metric) => send(metric, options));
    onCLS((metric) => send(metric, options));
    onFCP((metric) => send(metric, options));
  } catch (err) {
    console.error(`[Web Vitals] for page ${options.path}`, err);
  }
};
