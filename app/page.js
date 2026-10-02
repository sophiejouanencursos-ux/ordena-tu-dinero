"use client";
import { useMemo, useState } from "react";
import "./styles.css";

const money = n => new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN",maximumFractionDigits:0}).format(Number(n)||0);
const N = ({value,onChange,placeholder="$0"}) => <input type="number" min="0" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>;

export default function Home(){
  const [step,setStep]=useState(0);
  const [income,setIncome]=useState({salary:"",business:"",rent:"",other:""});
  const [expenses,setExpenses]=useState({housing:"",food:"",services:"",transport:"",education:"",health:"",personal:"",fun:"",subscriptions:"",other:""});
  const [debts,setDebts]=useState([{type:"Tarjeta de crédito",name:"",balance:"",payment:""}]);
  const [goals,setGoals]=useState([]);
  const [save,setSave]=useState("");
  const [saved,setSaved]=useState("");
  const [cut,setCut]=useState("");
  const [more,setMore]=useState("");
  const [extraDebt,setExtraDebt]=useState("");

  const totalIncome=useMemo(()=>Object.values(income).reduce((a,v)=>a+(+v||0),0),[income]);
  const totalExpenses=useMemo(()=>Object.values(expenses).reduce((a,v)=>a+(+v||0),0),[expenses]);
  const debtTotal=debts.reduce((a,d)=>a+(+d.balance||0),0);
  const debtPay=debts.reduce((a,d)=>a+(+d.payment||0),0);
  const available=totalIncome-totalExpenses-debtPay;
  const newAvailable=available+(+cut||0)+(+more||0)-(+extraDebt||0);
  const steps=["Ingresos","Gastos","Deudas","Metas","Tu plan"];
  const toggleGoal=g=>setGoals(x=>x.includes(g)?x.filter(y=>y!==g):[...x,g]);

  if(step===0) return <main className="landing">
    <Brand/>
    <div className="hero">
      <div><p className="eyebrow">UNA HERRAMIENTA DE EMPRENDIENDO CON ÉXITO</p>
      <h1>ORDENA TU <mark>DINERO</mark></h1>
      <h2>Pon tus finanzas en orden en pocos minutos.</h2>
      <p>Conoce cuánto entra, cuánto sale, cuánto debes y cuánto realmente te queda.</p>
      <div className="tiles">{["Tus ingresos","Tus gastos","Tus deudas","Tus metas"].map(x=><span key={x}>✓ {x}</span>)}</div>
      <button className="primary" onClick={()=>setStep(1)}>EMPEZAR →</button></div>
      <div className="bulb">💡</div>
    </div>
  </main>;

  const progress=<div className="progress">{steps.map((s,i)=><div className={step===i+1?"active":step>i+1?"done":""} key={s}><b>{i+1}</b><small>{s}</small></div>)}</div>;

  return <main><Brand/>{progress}
    {step===1 && <Section title="¿CUÁNTO DINERO RECIBES AL MES?" subtitle="Registra todos tus ingresos mensuales.">
      {Object.entries({salary:"Sueldo",business:"Negocio / ventas",rent:"Rentas",other:"Otros ingresos"}).map(([k,l])=><Field key={k} label={l}><N value={income[k]} onChange={v=>setIncome({...income,[k]:v})}/></Field>)}
      <Total label="Total de ingresos" value={totalIncome}/><Nav next={()=>setStep(2)}/>
    </Section>}
    {step===2 && <Section title="¿CUÁNTO GASTAS AL MES?" subtitle="Registra tus gastos mensuales para saber a dónde se va tu dinero.">
      {Object.entries({housing:"Vivienda",food:"Supermercado / comida",services:"Servicios",transport:"Transporte",education:"Educación",health:"Salud / seguros",personal:"Compras personales",fun:"Entretenimiento",subscriptions:"Suscripciones",other:"Otros"}).map(([k,l])=><Field key={k} label={l}><N value={expenses[k]} onChange={v=>setExpenses({...expenses,[k]:v})}/></Field>)}
      <Total label="Total de gastos" value={totalExpenses}/><Nav back={()=>setStep(1)} next={()=>setStep(3)}/>
    </Section>}
    {step===3 && <Section title="¿QUÉ DEUDAS TIENES HOY?" subtitle="Registra tus deudas para conocer tu situación real.">
      {debts.map((d,i)=><div className="debt" key={i}>
        <select value={d.type} onChange={e=>{let a=[...debts];a[i].type=e.target.value;setDebts(a)}}><option>Tarjeta de crédito</option><option>Hipoteca</option><option>Crédito de auto</option><option>Préstamo personal</option><option>Otra deuda</option></select>
        <input placeholder="Nombre opcional" value={d.name} onChange={e=>{let a=[...debts];a[i].name=e.target.value;setDebts(a)}}/>
        <N value={d.balance} onChange={v=>{let a=[...debts];a[i].balance=v;setDebts(a)}}/>
        <N value={d.payment} onChange={v=>{let a=[...debts];a[i].payment=v;setDebts(a)}}/>
      </div>)}
      <button className="secondary" onClick={()=>setDebts([...debts,{type:"Tarjeta de crédito",name:"",balance:"",payment:""}])}>+ AGREGAR OTRA DEUDA</button>
      <div className="summary"><Total label="Deuda total" value={debtTotal}/><Total label="Pagos mensuales" value={debtPay}/></div>
      <Nav back={()=>setStep(2)} next={()=>setStep(4)}/>
    </Section>}
    {step===4 && <Section title="¿QUÉ QUIERES LOGRAR CON TU DINERO?" subtitle="Selecciona una o varias opciones.">
      <div className="goals">{["Ahorrar más","Salir de deudas","Crear mi fondo de emergencia","Reducir mis gastos","Ahorrar para una compra importante","Invertir en el futuro","Llegar tranquilo a fin de mes","Simplemente organizar mi dinero"].map(g=><button key={g} onClick={()=>toggleGoal(g)} className={goals.includes(g)?"selected":""}>{goals.includes(g)?"✓ ":""}{g}</button>)}</div>
      <Field label="¿Cuánto te gustaría ahorrar al mes?"><N value={save} onChange={setSave}/></Field>
      <Field label="¿Cuánto dinero tienes ahorrado hoy?"><N value={saved} onChange={setSaved}/></Field>
      <Nav back={()=>setStep(3)} next={()=>setStep(5)} nextText="VER MI PLAN →"/>
    </Section>}
    {step===5 && <Section title="TU PLAN FINANCIERO" subtitle="Aquí está tu radiografía financiera.">
      <div className="cards"><Card t="Ingresos" v={money(totalIncome)}/><Card t="Gastos" v={money(totalExpenses)}/><Card t="Pagos de deuda" v={money(debtPay)}/><Card t="Disponible" v={money(available)}/><Card t="Ahorro actual" v={money(saved)}/></div>
      <h3>¿QUÉ PASA SI...?</h3>
      <p>Prueba diferentes escenarios y ve el resultado automáticamente.</p>
      <Field label="Reduzco mis gastos"><N value={cut} onChange={setCut}/></Field>
      <Field label="Aumento mis ingresos"><N value={more} onChange={setMore}/></Field>
      <Field label="Pago más a mis deudas"><N value={extraDebt} onChange={setExtraDebt}/></Field>
      <div className="result"><div><small>HOY</small><strong>{money(available)}</strong></div><div><small>CON TU NUEVO PLAN</small><strong>{money(newAvailable)}</strong></div><div><small>DIFERENCIA EN 12 MESES</small><strong>{money((newAvailable-available)*12)}</strong></div></div>
      <Nav back={()=>setStep(4)} next={()=>window.print()} nextText="GUARDAR / IMPRIMIR MI PLAN"/>
    </Section>}
  </main>
}
function Brand(){return <header><div className="brand">EMPRENDIENDO <em>CON</em> ÉXITO <span>💡</span></div><div className="appname">ORDENA TU DINERO</div></header>}
function Section({title,subtitle,children}){return <section><p className="eyebrow">ORDENA TU DINERO</p><h1>{title}</h1><p>{subtitle}</p><div className="form">{children}</div></section>}
function Field({label,children}){return <label className="field"><span>{label}</span>{children}</label>}
function Total({label,value}){return <div className="total"><span>{label}</span><strong>{money(value)}</strong></div>}
function Card({t,v}){return <div className="card"><small>{t}</small><strong>{v}</strong></div>}
function Nav({back,next,nextText="CONTINUAR →"}){return <div className="nav">{back?<button className="back" onClick={back}>← ATRÁS</button>:<span/>}<button className="primary" onClick={next}>{nextText}</button></div>}
