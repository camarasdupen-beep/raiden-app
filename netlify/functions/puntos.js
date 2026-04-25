const LOYVERSE_TOKEN = "bdbefadb2971447bb908a51d55397496";

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  const dni = event.queryStringParameters && event.queryStringParameters.dni;

  if (!dni || dni.length < 7) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "DNI inválido" }) };
  }

  try {
    const url = `https://api.loyverse.com/v1.0/customers?customer_code=${encodeURIComponent(dni)}&limit=1`;
    const resp = await fetch(url, {
      headers: { Authorization: `Bearer ${LOYVERSE_TOKEN}` }
    });
    const data = await resp.json();
    const clientes = data.customers || [];

    if (clientes.length === 0) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: "Cliente no encontrado" }) };
    }

    const c = clientes[0];
    return {
      statusCode: 200, headers,
      body: JSON.stringify({ nombre: (c.name || "").trim(), puntos: c.total_points || 0 })
    };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Error interno" }) };
  }
};
