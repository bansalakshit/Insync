export default (props) => {
    return (<img className="sm-profile-img" src={props.img ? props.img : '/static/img/no-image.png'} /> )
}