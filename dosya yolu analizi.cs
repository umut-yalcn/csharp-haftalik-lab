using System;

namespace DosyaYoluAnalizi
{
    class Program
    {
        static void Main()
        {
            Console.Write("Dosya yolunu giriniz: "); // Kullanıcıdan dosya yolu al
            string yol = Console.ReadLine().Trim(); // Baş ve sondaki boşlukları temizle

            DosyaAnaliz analiz = new DosyaAnaliz(); // Analiz için nesne oluştur

            if (!analiz.GecerliMi(yol)) // Yol geçerli değilse
            {
                Console.WriteLine("Geçersiz dosya yolu formatı!");
            }
            else
            {
                Console.WriteLine("Dosya Adı: " + analiz.DosyaAdi(yol)); // Uzantısız dosya adı
                Console.WriteLine("Uzantı: " + analiz.Uzanti(yol)); // Dosya uzantısı
                Console.WriteLine("Tür: " + analiz.DosyaTuru(yol)); // Uzantıya göre tür
            }
        }
    }

    class DosyaAnaliz
    {
        public bool GecerliMi(string yol)
        {
            // C:\ veya D:\ ile başlamalı
            if (!(yol.StartsWith("C:\\") || yol.StartsWith("D:\\")))
                return false;

            // Sürücü haricinde en az bir "\" daha olmalı
            if (yol.LastIndexOf('\\') <= 2)
                return false;

            // Son kısımda nokta olmalı ve en sonda bitmemeli
            int nokta = yol.LastIndexOf('.');
            if (nokta <= yol.LastIndexOf('\\') || nokta == yol.Length - 1)
                return false;

            return true; // Tüm şartlar sağlanıyorsa geçerli
        }

        public string DosyaAdi(string yol)
        {
            int sonSlash = yol.LastIndexOf('\\'); // Son klasör ayırıcıyı bul
            int nokta = yol.LastIndexOf('.'); // Dosya uzantısının noktasını bul
            return yol.Substring(sonSlash + 1, nokta - sonSlash - 1); // Aradaki metni döndür
        }

        public string Uzanti(string yol)
        {
            return yol.Substring(yol.LastIndexOf('.') + 1); // Son noktadan sonra gelen kısmı al
        }

        public string DosyaTuru(string yol)
        {
            string uzanti = Uzanti(yol).ToLower(); // Uzantıyı küçük harfe çevir

            if (uzanti == "pdf" || uzanti == "doc")
                return "Belge";
            if (uzanti == "jpg" || uzanti == "png")
                return "Görsel";
            if (uzanti == "exe")
                return "Çalıştırılabilir Uygulama";

            return "Diğer"; // Yukarıdakilere uymuyorsa Diğer
        }
    }
}