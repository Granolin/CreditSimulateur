using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Simu;

namespace SimuTest
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void TestMethod1()
        {
            int maxEmprunt = Calc.GetEmprunt(30, 3000, 2);
	    //On vérifie que c'est la bonne valeur
            Assert.AreEqual(maxEmprunt, 811646);

        }
    }
}
