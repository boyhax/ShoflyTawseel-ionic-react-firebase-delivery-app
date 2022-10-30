import { IonAvatar, IonImg } from '@ionic/react';
import * as React from 'react';
interface AvatarProps {
    onClick:(url:string)=>void,
    isColored:(v:string)=>boolean
}
 
interface AvatarState {
    seed:string,
    url:string
}
 
class Avatar extends React.Component<AvatarProps, AvatarState> {
    state = {  seed:require("../assets/avatarPlaceHolder.png"),url:"" }
    
    componentDidMount(){
        let seed = shuffle("abcdefghijklmnopqrstu1234567890")
        this.setState({seed:seed,
        url:url.replace("seed", this.state.seed)})
    }
    render() { 
        return ( <IonAvatar color={this.props.isColored(this.state.url)?"secondary":"light"}>
            <IonImg 
                onClick={()=>this.props.onClick(url.replace("seed", this.state.seed))} 
                src={url.replace("seed", this.state.seed)} >
            </IonImg>
            </IonAvatar> );
    }
}
 
export default Avatar;

var url = "https://avatars.dicebear.com/api/adventurer/seed.svg"
url = "https://robohash.org/seed"
function shuffle(s:string):string{
    let arr = Array.from(s)
    arr.sort(() =>{
        return 0.5-Math.random()
    })
    s = arr.toString().replaceAll(",","")
    return  s
}
export function  randomAvatarUrl(){
    let seed = shuffle("abcdefghijklmnopqrstu1234567890")
    return 'https://robohash.org/'+seed
}