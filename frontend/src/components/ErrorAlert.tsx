interface ErrorAlertProps {
  message: string;
  fieldErrors?: Record<string, string[]>;
}

export function ErrorAlert({ message, fieldErrors }: ErrorAlertProps) {
  const entries = fieldErrors ? Object.entries(fieldErrors) : [];

  return (
    <div className="error-alert" role="alert">
      <strong>{message}</strong>
      {entries.length > 0 && (
        <ul>
          {entries.flatMap(([field, messages]) =>
            messages.map((item) => (
              <li key={`${field}-${item}`}>
                <span>{field}</span>: {item}
              </li>
            )),
          )}
        </ul>
      )}
    </div>
  );
}
