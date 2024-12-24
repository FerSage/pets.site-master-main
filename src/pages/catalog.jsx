import Card from "../components/card";
import dogImage from '../media/собака.jpg';
let a={img:dogImage, type:'Белка', chip:'123', district:'Прииморский', date:'0/12/2024'};
function Catalog() {
    return ( <div>
        <Card data={a} />
        <Card data={{...a, chip:'456'}} />
       
    </div> );
}

export default Catalog;