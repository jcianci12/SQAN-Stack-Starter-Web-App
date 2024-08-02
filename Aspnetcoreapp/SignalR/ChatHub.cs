using System;
using System.Linq;
using System.Threading.Tasks;
using Aspnetcoreapp.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Aspnetcoreapp.SignalR
{
    [Authorize]
    public class ChatHub : Hub
    {
        //         public void UpdateUser (ApplicationUser user)
        //         {
        // Clients.User()
        //         }
        public ConnectionMapping<string>
            _connections = new ConnectionMapping<string>();

        //private readonly IChatHub _ChatHub;
        // public ChatHub(IChatHub chatHub)
        // {
        //     _ChatHub = chatHub;
        // }
        // public void SendChatMessage(MessageData messagedata)
        // {
            
        //      foreach (var
        //         connectionId
        //         in
        //         _connections.GetConnections(messagedata.RecepientId)
        //     )
        //     {
        //         var clients = Clients.Client(connectionId);
        //         if (clients != null)
        //         {
        //             Clients.Client(connectionId).SendAsync(messagedata.Message);
        //         }
        //     }
        // }

       

        public override Task OnConnectedAsync()
        {
            string name = Context.User.Identity.Name;

            _connections.Add(name, Context.ConnectionId);

            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception stopCalled)
        {
            string name = Context.User.Identity.Name;

            _connections.Remove(name, Context.ConnectionId);

            return base.OnDisconnectedAsync(stopCalled);
        }
    }

    // public interface IChatHub
    // {
    //     Task SendChatMessage(MessageData messagedata);
    // }
}
