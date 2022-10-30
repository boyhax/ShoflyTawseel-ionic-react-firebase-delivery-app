import { IonButton, IonCol, IonContent, IonGrid, IonHeader, IonModal, IonRow, IonToolbar } from '@ionic/react';
import * as React from 'react';
import Avatar from './Avatar';

interface AvatarPickerProps {
    onAvatarSubmit:(url:string)=>void,
    isOpen:boolean,
    onDidDismiss:()=>void

}
 
interface AvatarPickerState {
    url:string,
}
 
class AvatarPicker extends React.Component<AvatarPickerProps, AvatarPickerState> {
    state = {url:""}
    onAvatarClick(url:string){
        this.setState({url:url})
        
    }
    onSubmit(){
        this.props.onAvatarSubmit(this.state.url)
        this.setState({url:""})
    }
    render() { 
        return (<IonModal 
            id='AvatarPicker'
        canDismiss={true} 
        backdropDismiss={true} 
        initialBreakpoint={0.7} 
        isOpen={this.props.isOpen} 
        onDidDismiss={()=>this.props.onDidDismiss()}  
        key={"modal"}>
            <IonContent>
                <IonHeader>
                    <IonToolbar>
                        <IonButton disabled={!this.state.url} fill='clear' onClick={()=>this.onSubmit()}>Submit</IonButton>
                    </IonToolbar>
                </IonHeader>
                <IonGrid>
                    <IonRow>
                    {[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1].map((v,i)=>{
                    return<Avatar 
                    key={i} 
                    isColored={(v)=>{return v === this.state.url}}

                    onClick={(url)=>{this.onAvatarClick(url)}}>

                    </Avatar>
                })}
                    </IonRow>
                    
                </IonGrid>
            
            </IonContent>
            
        </IonModal>  );
    }
}
 
export default AvatarPicker;