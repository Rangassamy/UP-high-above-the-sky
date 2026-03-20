/* Formatage uniforme des prix en euros sur tout le frontend. */

export function eur(n){
  const v = Number(n || 0);
  return v.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}
