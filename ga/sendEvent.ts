export interface GaEventOptions {
  action: string;
  category?: string;
  label?: string;
  value?: string;
}

const sendGaEvent = ({ action, category, label, value }: GaEventOptions) => {
  gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
};

export default sendGaEvent;
