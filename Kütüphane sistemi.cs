Kütüphane sistemi

using System;

namespace KitapOrnegi
{
    class Program
    {
        static void Main()
        {
            // Örnek kitaplar oluştur
            Kitap kaynak = new Kitap("Kaynak Kitap", "Yazar A", 120, 2020);
            Kitap rakip = new Kitap("Rakip Kitap", "Yazar B", 100, 2019);

            kaynak.kiyasla(rakip); // Kaynak kitap rakiple kıyasla
            kaynak.bilgiGoster();  // Kaynak kitabın güncel bilgisi
            rakip.bilgiGoster();   // Rakip kitabın güncel bilgisi
        }
    }

    class Kitap
    {
        public string kitapAdi;
        public string yazarAdi;
        public int sayfaSayisi;
        public int yayinYili;

        // Kurucu: kitap bilgilerini alıp nesneyi hazırlar
        public Kitap(string kitapAdi, string yazarAdi, int sayfaSayisi, int yayinYili)
        {
            this.kitapAdi = kitapAdi;
            this.yazarAdi = yazarAdi;
            this.sayfaSayisi = sayfaSayisi;
            this.yayinYili = yayinYili;
        }

        // Kaynak kitabın, rakiap kitapla sayfa syısı bazlı kıyaslaması
        public void kiyasla(Kitap rakip)
        {
            if (this.sayfaSayisi >= rakip.sayfaSayisi)
            {
                rakip.yipran(20);   // Rakip 20 sayfa kaybeder
                this.yayinYili += 1; // Kaynak kitap yeni baskı almış gibi 1 yıl artar
            }
        }

        // Kitabın yıpranma işlemi
        public void yipran(int miktar)
        {
            sayfaSayisi -= miktar; // Sayfa sayısını azalt

            if (sayfaSayisi <= 0)
            {
                Console.WriteLine("Kitap piyasadan kalktı"); // Okunamayacak duruma geldi
            }
            else if (sayfaSayisi < 50)
            {
                yayinYili -= 1; // 50'nin altına düşerse kitap eskir
            }
        }

        // Kitabın güncel bilgilerini ekrana yazdır
        public void bilgiGoster()
        {
            Console.WriteLine("Kitap Adı: " + kitapAdi);
            Console.WriteLine("Yazar Adı: " + yazarAdi);
            Console.WriteLine("Sayfa Sayısı: " + sayfaSayisi);
            Console.WriteLine("Yayın Yılı: " + yayinYili);
            Console.WriteLine(); // Araya boş satır ekle
        }
    }
}