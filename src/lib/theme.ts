export interface StorefrontThemePalette {
  primaryColor: string;
  accentColor: string;
}

const defaultTheme: StorefrontThemePalette = {
  primaryColor: '#10b981',
  accentColor: '#0f172a',
};

function normalizeHexColor(value?: string | null) {
  if (!value) {
    return null;
  }

  const trimmedValue = value.trim();

  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(trimmedValue)) {
    return trimmedValue;
  }

  return null;
}

export function resolveStorefrontTheme(
  primaryColor?: string | null,
  accentColor?: string | null,
): StorefrontThemePalette {
  return {
    primaryColor: normalizeHexColor(primaryColor) ?? defaultTheme.primaryColor,
    accentColor: normalizeHexColor(accentColor) ?? defaultTheme.accentColor,
  };
}

export function hexToRgba(hexColor: string, alpha: number) {
  const hex = hexColor.replace('#', '');
  const normalizedHex =
    hex.length === 3
      ? hex
          .split('')
          .map((character) => `${character}${character}`)
          .join('')
      : hex;

  const red = Number.parseInt(normalizedHex.slice(0, 2), 16);
  const green = Number.parseInt(normalizedHex.slice(2, 4), 16);
  const blue = Number.parseInt(normalizedHex.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}
