namespace network_signal_monitoring.Models
{
    public class NetworkSignal
    {
        public int Id { get; set; }

        public string? NetworkType { get; set; }

        public string? Location { get; set; }

        public string? SignalStrength { get; set; }

        public double DownloadSpeed { get; set; }

        public double UploadSpeed { get; set; }
    }
}