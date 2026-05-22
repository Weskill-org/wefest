export interface PassSetting {
  id: string;
  name: string;
  enabled: boolean;
  price: number | string;
  days: number | string;
  single_day_price: number | string;
  multi_day_price: number | string;
}

export function parsePassSettings(raw: any): PassSetting[] {
  if (!raw) return [];
  
  if (Array.isArray(raw)) {
    return raw.map((p, idx) => ({
      id: p.id || `pass-${idx}-${Date.now()}`,
      name: p.name || 'Unnamed Pass',
      enabled: p.enabled !== undefined ? !!p.enabled : true,
      price: p.price !== undefined ? p.price.toString() : '',
      days: p.days !== undefined ? p.days.toString() : '1',
      single_day_price: p.single_day_price !== undefined ? p.single_day_price.toString() : '',
      multi_day_price: p.multi_day_price !== undefined ? p.multi_day_price.toString() : '',
    }));
  }

  // Handle old object format: { normal: ..., vip: ... }
  const result: PassSetting[] = [];
  if (raw.normal) {
    result.push({
      id: 'normal',
      name: 'Normal Pass',
      enabled: raw.normal.enabled !== undefined ? !!raw.normal.enabled : true,
      price: raw.normal.price !== undefined && raw.normal.price !== null ? raw.normal.price.toString() : '',
      days: raw.normal.days !== undefined && raw.normal.days !== null ? raw.normal.days.toString() : '1',
      single_day_price: raw.normal.single_day_price !== undefined && raw.normal.single_day_price !== null ? raw.normal.single_day_price.toString() : '',
      multi_day_price: raw.normal.multi_day_price !== undefined && raw.normal.multi_day_price !== null ? raw.normal.multi_day_price.toString() : '',
    });
  }
  if (raw.vip) {
    result.push({
      id: 'vip',
      name: 'VIP Pass',
      enabled: raw.vip.enabled !== undefined ? !!raw.vip.enabled : false,
      price: raw.vip.price !== undefined && raw.vip.price !== null ? raw.vip.price.toString() : '',
      days: raw.vip.days !== undefined && raw.vip.days !== null ? raw.vip.days.toString() : '1',
      single_day_price: raw.vip.single_day_price !== undefined && raw.vip.single_day_price !== null ? raw.vip.single_day_price.toString() : '',
      multi_day_price: raw.vip.multi_day_price !== undefined && raw.vip.multi_day_price !== null ? raw.vip.multi_day_price.toString() : '',
    });
  }
  return result;
}

export function serializePassSettings(passes: PassSetting[]) {
  return passes.map(p => ({
    id: p.id,
    name: p.name.trim() || 'Unnamed Pass',
    enabled: !!p.enabled,
    price: Number(p.price) || 0,
    days: Number(p.days) || 1,
    single_day_price: Number(p.single_day_price) || 0,
    multi_day_price: Number(p.multi_day_price) || 0,
  }));
}
