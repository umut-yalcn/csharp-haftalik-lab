// Videonun karakter kadrosu: bütün kesitlerde aynı kişiler görünür.
// Her biri karakter.js'in beklediği biçimde (görünüm sahnede belirlenir).
(function () {
  const KADRO = {
    deniz: { ten: "#C68A62", sac: { tip: "kisa", renk: "#2B1A12" }, ust: { tip: "kapusonlu", renk: "#2F6B4F" }, alt: { tip: "kot", renk: "#3B5C8C" }, ayakkabi: { renk: "#F2F2F2", taban: "#CFCFCF" }, canta: { tip: "sirt", renk: "#1E2230" } },
    elif: { ten: "#E8B898", sac: { tip: "dalgali", renk: "#6B3A1E" }, ust: { tip: "ceket", renk: "#C49A6C", uzun: true }, alt: { tip: "kumas", renk: "#2A2A35" }, ayakkabi: { renk: "#3A2418", taban: "#2A1A10" }, canta: { tip: "omuz", renk: "#7A2E2E" } },
    zeynep: { ten: "#F1C9A8", sac: { tip: "topuz", renk: "#1A1414" }, ust: { tip: "mont", renk: "#8C2F45" }, alt: { tip: "kot", renk: "#2E4A73" }, ayakkabi: { renk: "#FFFFFF", taban: "#18D1E3" } },
    emre: { ten: "#7A4A2E", sac: { tip: "kivircik", renk: "#120D0A" }, ust: { tip: "gomlek", renk: "#9CC3E6" }, alt: { tip: "kumas", renk: "#C8B48A" }, ayakkabi: { renk: "#5B3A22", taban: "#F2F2F2" }, kulaklik: "#1F1F1F", canta: { tip: "sirt", renk: "#E0A43A" } },
    can: { ten: "#D9A07A", sac: { tip: "bere", renk: "#C0392B" }, ust: { tip: "mont", renk: "#1F2A44" }, alt: { tip: "kot", renk: "#24324F" }, ayakkabi: { renk: "#E8E8E8", taban: "#B0B0B0" }, canta: { tip: "sirt", renk: "#4A5A3A" } },
    ayse: { ten: "#B9805A", sac: { tip: "uzun", renk: "#1C130E" }, ust: { tip: "kazak", renk: "#E3D3B8" }, alt: { tip: "etek", renk: "#3D4A6B" }, ayakkabi: { renk: "#2A2A2A", taban: "#111111" }, canta: { tip: "omuz", renk: "#18D1E3" } },
    baris: { ten: "#D8A47F", sac: { tip: "kisa", renk: "#1A120C" }, ust: { tip: "ceket", renk: "#3A4A6B" }, alt: { tip: "kumas", renk: "#4A4F5A" }, ayakkabi: { renk: "#2A1A10", taban: "#1A100A" } },
    mert: { ten: "#E3B48E", sac: { tip: "kisa", renk: "#8A5A2B" }, ust: { tip: "tisort", renk: "#F2F2F2" }, alt: { tip: "esofman", renk: "#1B1F2B", ikinci: "#18D1E3" }, ayakkabi: { renk: "#1E6BFF", taban: "#FFFFFF" } },
  };
  // ek: kadrodaki kişinin üzerine sahneye özel değişiklikler (ör. { canta: null })
  window.KP.kadro = (ad, gorunum = "arka", ek = {}) => ({ ...KADRO[ad], gorunum, ...ek });
})();
