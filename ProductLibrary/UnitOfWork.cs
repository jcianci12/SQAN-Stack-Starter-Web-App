

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Repositories;
using DAL.Repositories.Interfaces;

namespace DAL
{
    public class UnitOfWork : IUnitOfWork
    {
        readonly databaseContext _context;

        //IEpisodeRepository _episodes;
       



        public UnitOfWork(databaseContext context)
        {
            _context = context;
        }



        



        //public IProductRepository Products
        //{
        //    get
        //    {
        //        if (_products == null)
        //            _products = new ProductRepository(_context);

        //        return _products;
        //    }
        //}



        //public IOrdersRepository Orders
        //{
        //    get
        //    {
        //        if (_orders == null)
        //            _orders = new OrdersRepository(_context);

        //        return _orders;
        //    }
        //}




        public int SaveChanges()
        {
            return _context.SaveChanges();
        }
    }
}
