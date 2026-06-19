
const InfoCard = ({icon, title, para}) => {
    return (
        <div className="p-8 md:p-6 xl:p-8 bg-card border border-border rounded-md text-center flex flex-col justify-between items-center gap-4">
            <span className="text-5xl text-foreground">{icon}</span>
            <h2 className="text-xl text-foreground font-medium ">{title}</h2>
            <p className="text-muted text-sm line-clamp-5">{para}</p>
        </div>
    );
};

export default InfoCard;