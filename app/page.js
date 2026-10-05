"use client";

import { useEffect, useMemo, useState } from "react";
import "./styles.css";

const money = (n) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);

const num = (n) => Number(n) || 0;

const N = ({ value, onChange, placeholder = "$0" }) => (
  <input
    type="number"
    min="0"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
  />
);

export default function Home() {
  const [step, setStep] = useState(0);

  const [income, setIncome] = useState({
    salary: "",
    business: "",
    rent: "",
    other: "",
  });

  const [expenses, setExpenses] = useState({
    housing: "",
    food: "",
    services: "",
    transport: "",
    education: "",
    health: "",
    personal: "",
    fun: "",
    subscriptions: "",
    other: "",
  });

  const [debts, setDebts] = useState([
    {
      type: "Tarjeta de crédito",
      name: "",
      balance: "",
      payment: "",
    },
  ]);

  const [goals, setGoals] = useState([]);
  const [save, setSave] = useState("");
  const [saved, setSaved] = useState("");

  const [cut, setCut] = useState("");
  const [more, setMore] = useState("");
  const [extraDebt, setExtraDebt] = useState("");
  const [emergencyExpenses, setEmergencyExpenses] = useState("");
const [emergencySaved, setEmergencySaved] = useState("");
const meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const hoy = new Date();

const [month, setMonth] = useState(meses[hoy.getMonth()]);
const [year, setYear] = useState(hoy.getFullYear());
 const [datosCargados, setDatosCargados] = useState(false);

useEffect(() => {
  setDatosCargados(false);

  const clave = `ordenaTuDinero-${year}-${month}`;
  const datosGuardados = localStorage.getItem(clave);

  if (datosGuardados) {
    try {
      const datos = JSON.parse(datosGuardados);

      setIncome(
        datos.income || {
          salary: "",
          business: "",
          rent: "",
          other: "",
        }
      );

      setExpenses(
        datos.expenses || {
          housing: "",
          food: "",
          services: "",
          transport: "",
          education: "",
          health: "",
          personal: "",
          fun: "",
          subscriptions: "",
          other: "",
        }
      );

      setDebts(
        datos.debts || [
          {
            type: "Tarjeta de crédito",
            name: "",
            balance: "",
            payment: "",
          },
        ]
      );

      setGoals(datos.goals || []);
      setSave(datos.save ?? "");
      setSaved(datos.saved ?? "");
      setExtraDebt(datos.extraDebt ?? "");
    } catch (error) {
      console.error("No se pudieron recuperar los datos guardados.");
    }
  } else {
    setIncome({
      salary: "",
      business: "",
      rent: "",
      other: "",
    });

    setExpenses({
      housing: "",
      food: "",
      services: "",
      transport: "",
      education: "",
      health: "",
      personal: "",
      fun: "",
      subscriptions: "",
      other: "",
    });

    setDebts([
      {
        type: "Tarjeta de crédito",
        name: "",
        balance: "",
        payment: "",
      },
    ]);

    setGoals([]);
    setSave("");
    setSaved("");
    setExtraDebt("");
  }

  setDatosCargados(true);
}, [month, year]);

useEffect(() => {
  if (!datosCargados) return;

  const clave = `ordenaTuDinero-${year}-${month}`;

  const datos = {
    income,
    expenses,
    debts,
    goals,
    save,
    saved,
    extraDebt,
  };

  localStorage.setItem(clave, JSON.stringify(datos));
}, [
  income,
  expenses,
  debts,
  goals,
  save,
  saved,
  extraDebt,
  month,
  year,
  datosCargados,
]);  };

  localStorage.setItem("ordenaTuDinero", JSON.stringify(datos));
}, [income, expenses, debts, goals, save, saved]);

  const totalIncome = useMemo(
    () => Object.values(income).reduce((a, v) => a + num(v), 0),
    [income]
  );

  const totalExpenses = useMemo(
    () => Object.values(expenses).reduce((a, v) => a + num(v), 0),
    [expenses]
  );

  const debtTotal = debts.reduce((a, d) => a + num(d.balance), 0);
  const debtPay = debts.reduce((a, d) => a + num(d.payment), 0);

  const available = totalIncome - totalExpenses - debtPay;

  const newAvailable =
    available + num(cut) + num(more) - num(extraDebt);

  const expensePct =
    totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;

  const debtPct =
    totalIncome > 0 ? (debtPay / totalIncome) * 100 : 0;

  const availablePct =
    totalIncome > 0 ? Math.max(0, (available / totalIncome) * 100) : 0;

  const steps = ["Ingresos", "Gastos", "Deudas", "Metas", "Tu plan"];

  const toggleGoal = (g) =>
    setGoals((x) =>
      x.includes(g) ? x.filter((y) => y !== g) : [...x, g]
    );

  const diagnosis = () => {
    if (totalIncome <= 0) {
      return {
        title: "Completa tus ingresos",
        text: "Agrega tus ingresos para obtener tu diagnóstico financiero.",
      };
    }

    if (available < 0) {
      return {
        title: "Atención: estás gastando más de lo que ingresa",
        text: `Te faltan ${money(
          Math.abs(available)
        )} al mes para cubrir tus gastos y pagos de deuda.`,
      };
    }

    if (availablePct < 10) {
      return {
        title: "Tu presupuesto está muy ajustado",
        text: `Solo tienes disponible aproximadamente ${availablePct.toFixed(
          0
        )}% de tus ingresos.`,
      };
    }

    if (availablePct < 20) {
      return {
        title: "Vas por buen camino",
        text: `Tienes aproximadamente ${availablePct.toFixed(
          0
        )}% de tus ingresos disponible después de gastos y deudas.`,
      };
    }

    return {
      title: "Tienes un buen margen disponible",
      text: `Después de gastos y deudas conservas aproximadamente ${availablePct.toFixed(
        0
      )}% de tus ingresos.`,
    };
  };

  const diag = diagnosis();

  if (step === 0)
    return (
      <main className="landing">
        <Brand />

        <div className="hero">
          <div>
            <p className="eyebrow">
              UNA HERRAMIENTA DE EMPRENDIENDO CON ÉXITO
            </p>

            <h1>
              ORDENA TU <mark>DINERO</mark>
            </h1>

            <h2>Pon tus finanzas en orden en pocos minutos.</h2>

            <p>
              Conoce cuánto entra, cuánto sale, cuánto debes y cuánto
              realmente te queda.
            </p>

            <div className="period-selector">
  <label>¿QUÉ MES QUIERES ORGANIZAR?</label>

  <div className="period-fields">
    <select value={month} onChange={(e) => setMonth(e.target.value)}>
      {meses.map((mes) => (
        <option key={mes} value={mes}>
          {mes}
        </option>
      ))}
    </select>

    <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
      {[2025, 2026, 2027, 2028, 2029, 2030].map((año) => (
        <option key={año} value={año}>
          {año}
        </option>
      ))}
    </select>
  </div>
</div><div className="tiles">
              <span>Tus ingresos</span>
              <span>Tus gastos</span>
              <span>Tus deudas</span>
              <span>Tus metas</span>
            </div>

            <button className="primary" onClick={() => setStep(1)}>
              EMPEZAR
            </button>
          </div>
        </div>
      </main>
    );

  return (
    <main className="app">
      <Brand />

      <div className="progress">
        {steps.map((s, i) => (
          <div
            key={s}
            className={step === i + 1 ? "active" : ""}
          >
            <b>{i + 1}</b>
            <span>{s}</span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <Section
          title="Tus ingresos"
          intro="Anota cuánto dinero recibes normalmente cada mes."
        >
          <Field label="Sueldo">
            <N
              value={income.salary}
              onChange={(v) => setIncome({ ...income, salary: v })}
            />
          </Field>

          <Field label="Negocio / ventas">
            <N
              value={income.business}
              onChange={(v) => setIncome({ ...income, business: v })}
            />
          </Field>

          <Field label="Rentas">
            <N
              value={income.rent}
              onChange={(v) => setIncome({ ...income, rent: v })}
            />
          </Field>

          <Field label="Otros ingresos">
            <N
              value={income.other}
              onChange={(v) => setIncome({ ...income, other: v })}
            />
          </Field>

          <Total label="INGRESOS TOTALES" value={totalIncome} />
          <Nav step={step} setStep={setStep} />
        </Section>
      )}

      {step === 2 && (
        <Section
          title="Tus gastos"
          intro="Registra aproximadamente cuánto gastas al mes."
        >
          {[
            ["housing", "Vivienda"],
            ["food", "Alimentación"],
            ["services", "Servicios"],
            ["transport", "Transporte"],
            ["education", "Educación"],
            ["health", "Salud"],
            ["personal", "Gastos personales"],
            ["fun", "Entretenimiento"],
            ["subscriptions", "Suscripciones"],
            ["other", "Otros gastos"],
          ].map(([key, label]) => (
            <Field label={label} key={key}>
              <N
                value={expenses[key]}
                onChange={(v) =>
                  setExpenses({ ...expenses, [key]: v })
                }
              />
            </Field>
          ))}

          <Total label="GASTOS TOTALES" value={totalExpenses} />

          {totalIncome > 0 && (
            <p>
              Tus gastos representan aproximadamente{" "}
              <b>{expensePct.toFixed(0)}%</b> de tus ingresos.
            </p>
          )}

          <Nav step={step} setStep={setStep} />
        </Section>
      )}

      {step === 3 && (
        <Section
          title="Tus deudas"
          intro="Agrega tus deudas y cuánto pagas cada mes."
        >
          {debts.map((d, i) => (
            <Card key={i}>
              <Field label="Tipo de deuda">
                <select
                  value={d.type}
                  onChange={(e) => {
                    const x = [...debts];
                    x[i].type = e.target.value;
                    setDebts(x);
                  }}
                >
                  <option>Tarjeta de crédito</option>
                  <option>Crédito personal</option>
                  <option>Crédito automotriz</option>
                  <option>Hipoteca</option>
                  <option>Préstamo</option>
                  <option>Otra</option>
                </select>
              </Field>

              <Field label="Nombre">
                <input
                  value={d.name}
                  placeholder="Ej. Tarjeta principal"
                  onChange={(e) => {
                    const x = [...debts];
                    x[i].name = e.target.value;
                    setDebts(x);
                  }}
                />
              </Field>

              <Field label="Saldo pendiente">
                <N
                  value={d.balance}
                  onChange={(v) => {
                    const x = [...debts];
                    x[i].balance = v;
                    setDebts(x);
                  }}
                />
              </Field>

              <Field label="Pago mensual">
                <N
                  value={d.payment}
                  onChange={(v) => {
                    const x = [...debts];
                    x[i].payment = v;
                    setDebts(x);
                  }}
                />
              </Field>
            </Card>
          ))}

          <button
            className="secondary"
            onClick={() =>
              setDebts([
                ...debts,
                {
                  type: "Tarjeta de crédito",
                  name: "",
                  balance: "",
                  payment: "",
                },
              ])
            }
          >
            + AGREGAR OTRA DEUDA
          </button>

          <Total label="DEUDA TOTAL" value={debtTotal} />
          <Total label="PAGOS MENSUALES" value={debtPay} />

          <Nav step={step} setStep={setStep} />
        </Section>
      )}

      {step === 4 && (
        <Section
          title="Tus metas"
          intro="Elige qué quieres conseguir con tu dinero."
        >
          <div className="goalgrid">
           {[
  "Ahorrar",
  "Pagar deudas",
  "Fondo de emergencia",
].map((g) => (
              <button
                key={g}
                className={goals.includes(g) ? "goal selected" : "goal"}
                onClick={() => toggleGoal(g)}
              >
                {g}
              </button>
            ))}
          </div>

        {goals.some((g) => g !== "Pagar deudas") && (
  <>
    <Field label="¿Cuánto quieres ahorrar al mes?">
      <N value={save} onChange={setSave} />
    </Field>

    <Field label="¿Cuánto tienes ahorrado actualmente?">
      <N value={saved} onChange={setSaved} />
    </Field>
  </>
)}

{goals.includes("Pagar deudas") && (
  <Field label="¿Cuánto adicional quieres destinar a tus deudas al mes?">
    <N value={extraDebt} onChange={setExtraDebt} />
  </Field>
)}
{goals.includes("Fondo de emergencia") && (
  <>
    <Field label="¿Cuánto gastas al mes en tus gastos esenciales?">
      <N value={emergencyExpenses} onChange={setEmergencyExpenses} />
    </Field>

    <Field label="¿Cuánto tienes actualmente en tu fondo de emergencia?">
      <N value={emergencySaved} onChange={setEmergencySaved} />
    </Field>
  </>
)}
          <Nav step={step} setStep={setStep} />
        </Section>
      )}

      {step === 5 && (
        <Section
          title="Tu plan"
          intro="Esta es la fotografía actual de tus finanzas."
        >
          <div className="summarygrid">
            <Card>
              <small>INGRESOS</small>
              <h3>{money(totalIncome)}</h3>
            </Card>

            <Card>
              <small>GASTOS</small>
              <h3>{money(totalExpenses)}</h3>
            </Card>

            <Card>
              <small>PAGOS DE DEUDA</small>
              <h3>{money(debtPay)}</h3>
            </Card>

            <Card>
              <small>DISPONIBLE</small>
              <h3>{money(available)}</h3>
            </Card>
          </div>

          <h2>¿A dónde se va tu dinero?</h2>

          <MoneyBar
            label="Gastos"
            value={expensePct}
            amount={totalExpenses}
          />

          <MoneyBar
            label="Deudas"
            value={debtPct}
            amount={debtPay}
          />

          <MoneyBar
            label="Disponible"
            value={availablePct}
            amount={Math.max(0, available)}
          />

          <div className="diagnosis">
            <p className="eyebrow">TU DIAGNÓSTICO</p>
            <h2>{diag.title}</h2>
            <p>{diag.text}</p>

            {num(save) > 0 && available >= num(save) && (
              <p>
                ✓ Tu presupuesto actual permite cubrir tu meta de ahorro
                mensual de <b>{money(save)}</b>.
              </p>
            )}

            {num(save) > 0 && available < num(save) && (
              <p>
                Para alcanzar tu meta de ahorro de <b>{money(save)}</b>,
                necesitas liberar aproximadamente{" "}
                <b>{money(num(save) - available)}</b> adicionales al mes.
              </p>
            )}
          </div>

          <div className="simulator">
            <p className="eyebrow">SIMULADOR</p>
            <h2>¿Qué pasa si...?</h2>

            <Field label="Reduzco mis gastos en">
              <N value={cut} onChange={setCut} />
            </Field>

            <Field label="Genero ingresos adicionales de">
              <N value={more} onChange={setMore} />
            </Field>

            <Field label="Pago extra a mis deudas">
              <N value={extraDebt} onChange={setExtraDebt} />
            </Field>

            <div className="result">
  <div>
    <span>SITUACIÓN ACTUAL</span>
    <small>
      {available >= 0 ? "Te quedan al mes" : "Te faltan al mes"}
    </small>
    <strong>{money(Math.abs(available))}</strong>
  </div>

  {(num(cut) > 0 || num(more) > 0 || num(extraDebt) > 0) && (
  <>
    <div>
      <span>RESULTADO DE TU SIMULACIÓN</span>
      <small>
        {newAvailable >= 0
          ? "Te quedarían al mes"
          : "Te faltarían al mes"}
      </small>
      <strong>{money(Math.abs(newAvailable))}</strong>
    </div>

    <div>
      <span>IMPACTO EN 12 MESES</span>
      <small>Dinero adicional</small>
      <strong>{money((newAvailable - available) * 12)}</strong>
    </div>
  </>
)}
</div>
          </div>

          <button
            className="primary"
            onClick={() => window.print()}
          >
            GUARDAR / IMPRIMIR MI PLAN
          </button>
                   <button
  className="secondary"
  onClick={() => {
    const confirmar = window.confirm(
      "¿Quieres empezar un nuevo plan? Se borrarán todos los datos guardados en este dispositivo."
    );

    if (confirmar) {
      localStorage.removeItem("ordenaTuDinero");

      setIncome({
        salary: "",
        business: "",
        rent: "",
        other: "",
      });

      setExpenses({
        housing: "",
        food: "",
        services: "",
        transport: "",
        education: "",
        health: "",
        personal: "",
        fun: "",
        subscriptions: "",
        other: "",
      });

      setDebts([
        {
          type: "Tarjeta de crédito",
          name: "",
          balance: "",
          payment: "",
        },
      ]);

      setGoals([]);
      setSave("");
      setSaved("");
      setCut("");
      setMore("");
      setExtraDebt("");
      setStep(0);
    }
  }}
>
  NUEVO PLAN / EMPEZAR DE CERO
</button>

          <Nav step={step} setStep={setStep} />
        </Section>
      )}
    </main>
  );
}

function MoneyBar({ label, value, amount }) {
  const width = Math.min(100, Math.max(0, value));

  return (
    <div style={{ margin: "18px 0" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 7,
          gap: 10,
        }}
      >
        <strong>{label}</strong>
        <span>
          {money(amount)} · {value.toFixed(0)}%
        </span>
      </div>

      <div
        style={{
          width: "100%",
          height: 16,
          background: "#eeeeee",
          borderRadius: 20,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${width}%`,
            height: "100%",
            background: "#ffd400",
            borderRadius: 20,
          }}
        />
      </div>
    </div>
  );
}

function Brand() {
  return (
    <header className="brand">
     <img
  src="/LOGO SIN NOMBRE.JPG"
  alt="Emprendiendo con Éxito"
  className="brand-logo"
/>
      <span>ORDENA TU DINERO</span>
    </header>
  );
}

function Section({ title, intro, children }) {
  return (
    <section className="panel">
      <p className="eyebrow">ORDENA TU DINERO</p>
      <h1>{title}</h1>
      <p>{intro}</p>
      <div className="form">{children}</div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function Total({ label, value }) {
  return (
    <div className="total">
      <span>{label}</span>
      <strong>{money(value)}</strong>
    </div>
  );
}

function Card({ children }) {
  return <div className="card">{children}</div>;
}

function Nav({ step, setStep }) {
  return (
    <div className="nav">
      {step > 1 && (
        <button
          className="secondary"
          onClick={() => setStep(step - 1)}
        >
          ATRÁS
        </button>
      )}

      {step < 5 && (
        <button
          className="primary"
          onClick={() => setStep(step + 1)}
        >
          CONTINUAR
        </button>
      )}
    </div>
  );
}
