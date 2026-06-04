using System; // Gerekli sınıf ve metodları kullanabilmek için System ad alanını ekliyoruz.

namespace WebAdresAnalizi // Programımızın ad alanı
{
    class Program // Ana program sınıfı
    {
        static void Main(string[] args) // Programın başlangıç noktası
        {
            Console.Write("Web adresini giriniz: "); // Kullanıcıdan web adresini isteme
            string url = Console.ReadLine().ToLower().Trim(); // Kullanıcının girdiği adresi oku, küçük harfe çevir ve baş/son boşlukları kaldır

            // WebAnaliz sınıfından nesne oluşturuluyor
            WebAnaliz analiz = new WebAnaliz(); // Bu satır sınıfın metodlarını kullanmak için nesne oluşturuyor

            // 1. Kriter: Geçerlilik Kontrolü
            if ((url.StartsWith("http://") || url.StartsWith("https://")) && url.Contains("www") && NoktaSayisiBul(url) >= 3)
            {
                Console.WriteLine("\n--- ANALİZ SONUÇLARI ---"); // Geçerli adresse analiz sonuçlarını yazdır
                Console.WriteLine("Domain: " + analiz.DomainBul(url)); // Domaini ekrana yazdır
                Console.WriteLine("Ülke/Tür: " + analiz.UlkeBul(url)); // Ülke veya tür bilgisini ekrana yazdır
            }
            else
            {
                Console.WriteLine("Geçersiz web adresi formatı!"); // Adres kurallara uymuyorsa hata mesajı göster
            }
            Console.ReadLine(); // Programın hemen kapanmaması için kullanıcıdan bir tuş bekle
        }

        // Nokta sayısını bulan yardımcı metot (Main içinde kolaylık sağlasın diye)
        static int NoktaSayisiBul(string metin)
        {
            int sayac = 0; // Nokta sayısını tutacak değişken
            foreach (char c in metin) // Metindeki her karakteri kontrol et
            {
                if (c == '.') // Karakter nokta mı?
                {
                    sayac++; // Nokta ise sayacı artır
                }
            }
            return sayac; // Toplam noktayı döndür
        }
    }

    class WebAnaliz // Web adresini analiz eden sınıf
    {
        // 2. Kriter: Domain Ayrıştırma
        public string DomainBul(string url)
        {
            int baslangic = url.IndexOf("www.") + 4; // "www." ifadesinin bittiği yeri bul
            int bitis = url.IndexOf('.', baslangic); // Domain sonrasında gelen ilk noktayı bul
            return url.Substring(baslangic, bitis - baslangic); // www. ile sonraki nokta arasındaki metni döndür
        }

        // 3. Kriter: Uzantı ve Ülke Kontrolü
        public string UlkeBul(string url)
        {
            if (url.EndsWith(".tr")) return "Türkiye"; // .tr uzantısı Türkiye anlamına gelir
            if (url.EndsWith(".uk")) return "İngiltere"; // .uk uzantısı İngiltere anlamına gelir
            if (url.EndsWith(".com")) return "Ticari/Evrensel"; // .com uzantısı ticari veya evrensel anlamına gelir
            return "Diğer"; // Yukarıdakilerden biri değilse diğer ülkeler/türler
        }
    }
}