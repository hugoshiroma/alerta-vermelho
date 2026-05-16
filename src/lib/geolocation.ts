export interface LocationData {
  lat: number;
  lng: number;
  address: string;
  mapsUrl: string;
}

export async function getCurrentLocation(): Promise<LocationData> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocalização não suportada neste dispositivo."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        let address = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=pt-BR`
          );
          const data = await res.json();
          if (data.display_name) address = data.display_name;
        } catch {
          // Usa coordenadas brutas se reverse geocoding falhar
        }

        resolve({
          lat,
          lng,
          address,
          mapsUrl: `https://maps.google.com/maps?q=${lat},${lng}`,
        });
      },
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

export function buildEmergencyMessage(location: LocationData, name = ""): string {
  const nameStr = name ? `${name} ` : "";
  return `🚨 EMERGÊNCIA! ${nameStr}precisa de ajuda!\n\n📍 Localização: ${location.address}\n\n🗺️ Ver no mapa: ${location.mapsUrl}\n\n⚠️ Por favor, ligue para ela ou chame a polícia imediatamente!`;
}

export function openWhatsApp(phone: string, message: string): void {
  const cleaned = phone.replace(/\D/g, "");
  const withCountry = cleaned.startsWith("55") ? cleaned : `55${cleaned}`;
  window.open(
    `https://wa.me/${withCountry}?text=${encodeURIComponent(message)}`,
    "_blank"
  );
}
