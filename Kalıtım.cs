Kalıtım

/*using System;

namespace KalitimOrnegi
{
    class Program
    {
        static void Main()
        {
            Yazilimci yazilimci = new Yazilimci("Ahmet", 5000, "C#");
            yazilimci.Yazdir(); // 3 bilgiyi de yazdır
        }
    }

    class Personel // Temel sınıf
    {
        private string ad;
        private double maas;

        public string Ad
        {
            get => ad;
            set => ad = value;
        }

        public double Maas
        {
            get => maas;
            set => maas = value;
        }

        public Personel(string ad, double maas)
        {
            Ad = ad;
            Maas = maas;
        }

        protected void Yazdir()
        {
            Console.WriteLine("Ad: " + Ad);
            Console.WriteLine("Maaş: " + Maas);
        }
    }

    class Yazilimci : Personel // Personel'den türet
    {
        private string programlamaDili;

        public string ProgramlamaDili
        {
            get => programlamaDili;
            set => programlamaDili = value;
        }

        public Yazilimci(string ad, double maas, string programlamaDili) 
            : base(ad, maas) // base kullanarak Personel kurucu'suna gönder
        {
            ProgramlamaDili = programlamaDili;
        }

        public void Yazdir()
        {
            base.Yazdir(); // Üst sınıfın Yazdir'ını çağır (ad ve maaş)
            Console.WriteLine("Programlama Dili: " + ProgramlamaDili); // Kendi bilgisini ekle
        }
    }
}*/ 


using System;

namespace KalitimOrnegi
{
    class Program
    {
        static void Main()
        {
            Yazilimci yazilimci = new Yazilimci("Ahmet", 5000, "C#");
            yazilimci.Yazdir(); // 3 bilgiyi de yazdır
        }
    }

    class Personel // Temel sınıf
    {
        private string ad;
        private double maas;

        public string Ad
        {
            get => ad;
            set => ad = value;
        }

        public double Maas
        {
            get => maas;
            set => maas = value;
        }

        public Personel(string ad, double maas)
        {
            Ad = ad;
            Maas = maas;
        }

        protected void Yazdir()
        {
            Console.WriteLine("Ad: " + Ad);
            Console.WriteLine("Maaş: " + Maas);
        }
    }

    class Yazilimci : Personel // Personel'den türet
    {
        private string programlamaDili;

        public string ProgramlamaDili
        {
            get => programlamaDili;
            set => programlamaDili = value;
        }

        public Yazilimci(string ad, double maas, string programlamaDili) 
            : base(ad, maas) // base kullanarak Personel kurucu'suna gönder
        {
            ProgramlamaDili = programlamaDili;
        }

        public void Yazdir()
        {
            base.Yazdir(); // Üst sınıfın Yazdir'ını çağır (ad ve maaş)
            Console.WriteLine("Programlama Dili: " + ProgramlamaDili); // Kendi bilgisini ekle
        }
    }
}