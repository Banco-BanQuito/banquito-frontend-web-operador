import PropTypes from 'prop-types';

export function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`dashboard-card ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-6 ${className}`}>
      {children}
    </div>
  );
}

CardHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export function CardTitle({ children, className = '' }) {
  return (
    <h2 className={`text-xl font-bold text-gray-900 ${className}`} style={{ color: '#001f3f' }}>
      {children}
    </h2>
  );
}

CardTitle.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export function CardContent({ children, className = '' }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {children}
    </div>
  );
}

CardContent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
