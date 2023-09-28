using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Infrastructue.Data;

namespace Infrastructure.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly StoreContext _context;
        private Hashtable _repositories;
        public UnitOfWork(StoreContext context)
        {
            _context = context;
        }
        public async Task<int> Complete()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity
        {
            if(_repositories == null) _repositories = new Hashtable(); //checa se temos alguma coisa no hashtable
            
            var type = typeof(TEntity).Name; //saber o nome da entidade

            if(!_repositories.ContainsKey(type)) 
            {
                var repositoryType = typeof(GenericRepository<>); //cria um repository de um GenericRepository
                var repositoryInstance = Activator.CreateInstance(repositoryType.MakeGenericType
                (typeof(TEntity)), _context); //cria a instância do repositório

                _repositories.Add(type, repositoryInstance);
            }

            return (IGenericRepository<TEntity>) _repositories[type];
        }
    }
}