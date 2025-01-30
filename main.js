import*as T from'three';import{GLTFLoader}from'three/addons/loaders/GLTFLoader.js';import{OrbitControls}from'three/addons/controls/OrbitControls.js';
const c=document.getElementById('hero');if(!c)throw'No container';
const s=new T.Scene,r=new T.WebGLRenderer({antialias:!0,alpha:!0}),m=new T.PerspectiveCamera(75,c.clientWidth/c.clientHeight,.1,1e3);
s.background=new T.Color(0x1a1a1a);
s.add(new T.AmbientLight(0xffffff,15));
const d=new T.DirectionalLight(0xffffff,10);d.position.set(5,5,5);s.add(d);
r.setSize(c.clientWidth,c.clientHeight);c.appendChild(r.domElement);
let f=!1,t=Math.PI/6,u=0;m.position.z=5;
const g=new T.BufferGeometry,n=100,p=new Float32Array(3*n),v=new Float32Array(3*n);
for(let i=0;i<3*n;i++){p[i]=.5*(Math.random()-.5)*10;v[i]=.5*(Math.random()-.5)*.02}
g.setAttribute('position',new T.BufferAttribute(p,3));
const P=new T.Points(g,new T.PointsMaterial({size:.05,color:0xb233ff,transparent:!0,opacity:.8}));s.add(P);
let l=new T.BufferGeometry,h=[],w=null,L=new T.LineSegments(l,new T.LineBasicMaterial({color:0xb233ff,transparent:!0,opacity:.3}));s.add(L);
new T.TextureLoader().load('public/mozzart.png',x=>{w=new T.Mesh(new T.PlaneGeometry(5,4),new T.MeshBasicMaterial({map:x,transparent:!0,side:T.DoubleSide}));s.add(w)});
const U=()=>{if(w){u+=f?.002:-.002;f=u>=t?(u=t,!1):u<=0?(u=0,!0):f;w.rotation.y=u}
const o=g.attributes.position.array;for(let i=0;i<3*n;i++){o[i]+=v[i];Math.abs(o[i])>5&&(v[i]*=-1)}
g.attributes.position.needsUpdate=!0;h=[];
for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){const[x1,y1,z1]=[o[3*i],o[3*i+1],o[3*i+2]],[x2,y2,z2]=[o[3*j],o[3*j+1],o[3*j+2]],d=Math.hypot(x2-x1,y2-y1,z2-z1);d<2&&h.push(x1,y1,z1,x2,y2,z2)}
l.dispose();l=new T.BufferGeometry;l.setAttribute('position',new T.Float32BufferAttribute(h,3));r.render(s,m)};
const R=()=>{m.aspect=c.clientWidth/c.clientHeight;m.updateProjectionMatrix();r.setSize(c.clientWidth,c.clientHeight)};
window.addEventListener('resize',R);r.setAnimationLoop(U);R();