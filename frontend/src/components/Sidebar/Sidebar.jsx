import "./Sidebar.scss";

export const Sidebar = ({children}) => {

    return (
        <aside className="sidebar">
            <ul className="sidebar__items">
                {children}
            </ul>
        </aside>
    )
};
