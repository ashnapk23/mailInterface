const allowedOrigins=require('./allowedOrigins')
const corsOpitons={
    origin:(origin,callback)=>{
        if(allowedOrigins.indexOf(origin)!==-1||!origin)
        {callback(null,true)}
        else
        {callback(new Error('Not allowed by CORS'))}
    },
        optionsSuccessStatus:200
}
module.exports=corsOpitons;
