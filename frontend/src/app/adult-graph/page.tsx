import Graph from "@/components/graph";
import Navbar from "@/components/navbar";

export default function AdultGraph(){
    return (
        <>
            <Navbar />
            <div className = "h-30 w-full bg-slate-900"></div>
            <Graph />
        </>
    );
}