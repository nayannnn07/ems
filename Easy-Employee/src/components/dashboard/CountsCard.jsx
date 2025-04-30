const CountsCard = ({ title, icon, count }) => {
  return (
    <div className="card card-statistic-1 h-100">
      <div className="card-icon bg-primary">
        <i className={`far ${icon}`}></i>
      </div>
      <div className="card-wrap">
        <div className="card-header">
          <h4>{title}</h4>
        </div>
        <div className="card-body">{count}</div>
      </div>
    </div>
  );
};
export default CountsCard;
