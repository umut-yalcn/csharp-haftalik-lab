Kargo sistemi

/*Soru: Bir kargo şirketi için Kargo sınıfını tasarlamanız istenmektedir.


İstenenler:

Üye Değişkenler: gondericiAdi (string), agirlik (double), mesafe (int) ve başlangıç değeri false olan hizliTeslimatMi (bool) değişkenlerini private olarak tanımlayınız.

Kapsülleme (Properties): Değişkenler için get/set bloklarını yazınız.

Kural: agirlik değerine 0 veya negatif bir sayı girilmek istenirse, ağırlık otomatik olarak 1 kabul edilmelidir.

Kural: mesafe değerine 0 veya negatif bir sayı girilmek istenirse, mesafe otomatik olarak 10 kabul edilmelidir.

Kurucu Metot: Dışarıdan sadece gondericiAdi, agirlik ve mesafe parametrelerini alıp özellikler (properties) üzerinden atamalarını yapan metodu yazınız.

Üye Metotlar:

hizliKargoSec(): Çağrıldığında kargonun hizliTeslimatMi durumunu true yapar.

ucretHesapla(): Temel ücret (agirlik * 15) + (mesafe * 3) formülüyle hesaplanır.

Eğer ağırlık 50 kg'dan büyükse toplama 100 TL ağır paket bedeli eklenir.

Eğer ağırlık 30 kg ile 50 kg arasındaysa toplama 50 TL eklenir.

Son olarak; eğer kargo hızlı teslimat seçilmişse, toplam ücretin üzerine 150 TL sabit hizmet bedeli daha eklenerek sonuç döndürülür (return).

bilgiGoster(): Gönderici bilgilerini, hızlı kargo durumunu ve hesaplanan net ücreti ekrana yazdırır.

Main Metodu: 2 nesne üretiniz, birinin ağırlığını kasıtlı olarak hatalı girip property kontrolünü test ediniz ve birine hızlı kargo metodu uygulayarak bilgileri ekrana yazdırınız. */

using System;

namespace KargoSirketi
{
    class Program
    {
        static void Main()
        {
            // Hatalı ağırlık girildiğinde property koruması çalışır
            Kargo k1 = new Kargo("Ali", -5, 20);
            // Hızlı teslimat seçili kargo
            Kargo k2 = new Kargo("Ayşe", 35, 50);
            k2.hizliKargoSec();

            k1.bilgiGoster();
            k2.bilgiGoster();
        }
    }

    class Kargo
    {
        private string gondericiAdi;
        private double agirlik;
        private int mesafe;
        private bool hizliTeslimatMi = false;

        public string GondericiAdi
        {
            get => gondericiAdi;
            set => gondericiAdi = value;
        }

        public double Agirlik
        {
            get => agirlik;
            set => agirlik = value <= 0 ? 1 : value; // 0 veya negatif ise 1 kabul et
        }

        public int Mesafe
        {
            get => mesafe;
            set => mesafe = value <= 0 ? 10 : value; // 0 veya negatif ise 10 kabul et
        }

        public bool HizliTeslimatMi
        {
            get => hizliTeslimatMi;
            set => hizliTeslimatMi = value;
        }

        // Kurucu sadece gönderici adı, ağırlık ve mesafe alır
        public Kargo(string gondericiAdi, double agirlik, int mesafe)
        {
            GondericiAdi = gondericiAdi;
            Agirlik = agirlik;
            Mesafe = mesafe;
        }

        // Hızlı kargo seçimi
        public void hizliKargoSec()
        {
            HizliTeslimatMi = true;
        }

        // Ücret hesaplama
        public double ucretHesapla()
        {
            double toplam = Agirlik * 15 + Mesafe * 3;

            if (Agirlik > 50)
                toplam += 100;
            else if (Agirlik >= 30)
                toplam += 50;

            if (HizliTeslimatMi)
                toplam += 150;

            return toplam;
        }

        // Bilgileri ekrana yazdırma
        public void bilgiGoster()
        {
            Console.WriteLine("Gönderici: " + GondericiAdi);
            Console.WriteLine("Ağırlık: " + Agirlik + " kg");
            Console.WriteLine("Mesafe: " + Mesafe + " km");
            Console.WriteLine("Hızlı Teslimat: " + (HizliTeslimatMi ? "Evet" : "Hayır"));
            Console.WriteLine("Ücret: " + ucretHesapla() + " TL");
            Console.WriteLine();
        }
    }
}