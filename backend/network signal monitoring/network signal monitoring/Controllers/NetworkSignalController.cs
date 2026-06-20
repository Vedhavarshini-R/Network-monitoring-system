using Microsoft.AspNetCore.Mvc;
using network_signal_monitoring.Data;
using network_signal_monitoring.Models;

namespace network_signal_monitoring.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class NetworkSignalController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NetworkSignalController(AppDbContext context)
        {
            _context = context;
        }

        // GET ALL SIGNALS

        [HttpGet]
        public IActionResult Get()
        {
            var signals = _context.NetworkSignals.ToList();

            return Ok(signals);
        }

        // POST NEW SIGNAL

        [HttpPost]
        public IActionResult Post(NetworkSignal signal)
        {
            _context.NetworkSignals.Add(signal);

            _context.SaveChanges();

            return Ok(signal);
        }

        // PUT UPDATE SIGNAL

        [HttpPut("{id}")]
        public IActionResult Put(int id, NetworkSignal updatedSignal)
        {
            var signal = _context.NetworkSignals.Find(id);

            if (signal == null)
            {
                return NotFound();
            }

            signal.NetworkType = updatedSignal.NetworkType;
            signal.DownloadSpeed = updatedSignal.DownloadSpeed;
            signal.UploadSpeed = updatedSignal.UploadSpeed;
            signal.SignalStrength = updatedSignal.SignalStrength;

            _context.SaveChanges();

            return Ok(signal);
        }

        // DELETE SIGNAL

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var signal = _context.NetworkSignals.Find(id);

            if (signal == null)
            {
                return NotFound();
            }

            _context.NetworkSignals.Remove(signal);

            _context.SaveChanges();

            return Ok();
        }
    }
}