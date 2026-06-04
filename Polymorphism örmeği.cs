Polymorphism örmeği

/*using System;

namespace BinaOrnegi
{
    class Program
    {
        static void Main()
        {
            betonBina b1 = new betonBina("konut", 10, 80, 2500, "kule");
            b1.hesap();
            b1.yaz();

            betonBina b2 = new betonBina("ofis", 8, 100, 2200, "blok");
            b2.hesap();
            b2.yaz();
        }
    }

    class Bina
    {
        private static int sayaç = 0; // Otomatik açıklama sayacı

        public string turu { get; set; }
        public int daire_sayisi { get; set; }
        public double daire_boyutu { get; set; }
        public double m2fiyat { get; set; }
        public double toplamfiyat { get; set; }
        public string aciklama { get; set; }

        public Bina(string turu, int daire_sayisi, double daire_boyutu, double m2fiyat)
        {
            Console.WriteLine("ben bina kurucusuyum");
            this.turu = turu;
            this.daire_sayisi = daire_sayisi;
            this.daire_boyutu = daire_boyutu;
            this.m2fiyat = m2fiyat;
            sayaç++;
            aciklama = sayaç + ". bina"; // Otomatik açıklama
        }

        public void hesap()
        {
            toplamfiyat = daire_sayisi * daire_boyutu * m2fiyat;
        }

        public virtual void yaz()
        {
            Console.WriteLine("Açıklama: " + aciklama);
            Console.WriteLine("Tür: " + turu);
            Console.WriteLine("Daire Sayısı: " + daire_sayisi);
            Console.WriteLine("Daire Boyutu: " + daire_boyutu);
            Console.WriteLine("m2 Fiyat: " + m2fiyat);
            Console.WriteLine("Toplam Fiyat: " + toplamfiyat);
            Console.WriteLine();
        }
    }

    class betonBina : Bina
    {
        public string binaTuru { get; set; }

        public betonBina(string turu, int daire_sayisi, double daire_boyutu, double m2fiyat, string binaTuru)
            : base(turu, daire_sayisi, daire_boyutu, m2fiyat)
        {
            Console.WriteLine("beton binayım");
            this.binaTuru = binaTuru;
        }

        public override void yaz()
        {
            base.yaz(); // Temel bilgileri yaz
            Console.WriteLine("Bina Türü: " + binaTuru);
            Console.WriteLine();
        }
    }
}*/


using System;

namespace BinaOrnegi
{
    class Program
    {
        static void Main()
        {
            betonBina b1 = new betonBina("konut", 10, 80, 2500, "kule");
            b1.hesap();
            b1.yaz();

            betonBina b2 = new betonBina("ofis", 8, 100, 2200, "blok");
            b2.hesap();
            b2.yaz();
        }
    }

    class Bina
    {
        private static int sayaç = 0; // Otomatik açıklama sayacı

        public string turu { get; set; }
        public int daire_sayisi { get; set; }
        public double daire_boyutu { get; set; }
        public double m2fiyat { get; set; }
        public double toplamfiyat { get; set; }
        public string aciklama { get; set; }

        public Bina(string turu, int daire_sayisi, double daire_boyutu, double m2fiyat)
        {
            Console.WriteLine("ben bina kurucusuyum");
            this.turu = turu;
            this.daire_sayisi = daire_sayisi;
            this.daire_boyutu = daire_boyutu;
            this.m2fiyat = m2fiyat;
            sayaç++;
            aciklama = sayaç + ". bina"; // Otomatik açıklama
        }

        public void hesap()
        {
            toplamfiyat = daire_sayisi * daire_boyutu * m2fiyat;
        }

        public virtual void yaz()
        {
            Console.WriteLine("Açıklama: " + aciklama);
            Console.WriteLine("Tür: " + turu);
            Console.WriteLine("Daire Sayısı: " + daire_sayisi);
            Console.WriteLine("Daire Boyutu: " + daire_boyutu);
            Console.WriteLine("m2 Fiyat: " + m2fiyat);
            Console.WriteLine("Toplam Fiyat: " + toplamfiyat);
            Console.WriteLine();
        }
    }

    class betonBina : Bina
    {
        public string binaTuru { get; set; }

        public betonBina(string turu, int daire_sayisi, double daire_boyutu, double m2fiyat, string binaTuru)
            : base(turu, daire_sayisi, daire_boyutu, m2fiyat)
        {
            Console.WriteLine("beton binayım");
            this.binaTuru = binaTuru;
        }

        public override void yaz()
        {
            base.yaz(); // Temel bilgileri yaz
            Console.WriteLine("Bina Türü: " + binaTuru);
            Console.WriteLine();
        }
    }
}