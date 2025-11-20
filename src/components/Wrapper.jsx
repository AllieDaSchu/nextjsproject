const Wrapper = ({children, id}) => {
    return (
        <div className="section" id={id}>
            <div className="container">
                {children}
            </div>
        </div>
    )
}

export default Wrapper

;